# React/Vite Deployment Tutorial with Docker, Nginx, and SSL

This tutorial provides detailed step-by-step instructions to deploy a React/Vite project on an EC2 instance using Docker, Nginx, and Certbot for SSL certificates. Each step includes examples to make the process clear.

---

## Table of Contents

1. [Git Repository Setup](#git-repository-setup)
2. [Project Structure](#project-structure)
3. [React/Vite App Setup](#reactvite-app-setup)
4. [EC2 Instance Setup](#ec2-instance-setup)
5. [Install Docker on EC2](#install-docker-on-ec2)
6. [Docker Compose Configuration](#docker-compose-configuration)
7. [Nginx Configuration](#nginx-configuration)
8. [Push to Git](#push-to-git)
9. [Deploy on EC2](#deploy-on-ec2)
10. [Build React App](#build-react-app)
11. [Start Docker Containers](#start-docker-containers)
12. [Generate SSL Certificates](#generate-ssl-certificates)
13. [Restart Docker Containers](#restart-docker-containers)

---

## 1. Git Repository Setup

Git is used for version control and makes it easier to deploy projects to remote servers.

1. Create a new repository on GitHub (or any Git provider).
2. Clone the repository locally:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

> Example: `git clone https://github.com/lucas/my-react-vite-app.git`

---

## 2. Project Structure

Organizing your project with a clear structure helps Docker and Nginx find the files correctly.

**Recommended structure:**

```
project-root/
│
├── app/       # React/Vite application code
├── nginx/     # Nginx configuration files
└── docker-compose.yml  # Docker services definition
```

> `app/dist` will contain your production-ready files after building.

---

## 3. React/Vite App Setup

Inside `app/`, create `package.json`:

```json
{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

> `npm run build` will generate a `dist/` folder with optimized files ready for deployment.

---

## 4. EC2 Instance Setup

1. Launch an Ubuntu EC2 instance.
2. Connect via SSH:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. Update packages:

```bash
sudo apt update && sudo apt upgrade -y
```

> Example: `ssh -i my-key.pem ubuntu@54.123.45.67`

---

## 5. Install Docker on EC2

Install Docker using the official script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

> This will install Docker and the `docker` command on your EC2 instance. You can verify with `docker --version`.

---

## 6. Docker Compose Configuration

Docker Compose simplifies running multiple containers, e.g., Nginx and Certbot, together.

**docker-compose.yml example:**

```yaml
version: "3.9"
services:
  nginx:
    image: nginx:alpine
    container_name: react_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./app/dist:/usr/share/nginx/html:ro
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/lib/letsencrypt:/var/lib/letsencrypt:ro
    depends_on:
      - certbot

  certbot:
    image: certbot/certbot
    container_name: certbot
    restart: unless-stopped
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/lib/letsencrypt:/var/lib/letsencrypt
      - ./app/dist:/usr/share/nginx/html:ro
    entrypoint: |
      /bin/sh -c "
      trap exit TERM;
      while :; do
        certbot renew --webroot -w /usr/share/nginx/html --quiet;
        sleep 12h & wait \$${!};
      done
      "
```

> This setup maps SSL certificate directories from the host and ensures Certbot renews them automatically.

---

## 7. Nginx Configuration

Update `nginx/default.conf` with your server and SSL settings.

```nginx
# Inclui os tipos MIME padrão
include /etc/nginx/mime.types;
default_type application/octet-stream;

# Redireciona HTTP para HTTPS
server {
    listen 80;
    server_name main-domain-example.online www.main-domain-example.online;

    # Redireciona todas as requisições para HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Servidor HTTPS
server {
    listen 443 ssl http2;
    server_name main-domain-example.online www.main-domain-example.online;

    # Certificados SSL Let's Encrypt
    ssl_certificate /etc/letsencrypt/live/main-domain-example.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/main-domain-example.online/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Diretório do build do React
    root /usr/share/nginx/html;
    index index.html index.htm;

    # SPA fallback
    location / {
        try_files $uri /index.html;
    }

    # Cache de arquivos estáticos e garantia de MIME type correto
    location ~* \.(?:css|js|mjs|json|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|ico)$ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public";
    }

    # Evita servir arquivos ocultos como .env ou .git
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}

```

> Replace `your-domain.com` with your actual domain.

---

## 8. Push to Git

Keep your project on Git for easy deployment.

```bash
git add .
git commit -m "Initial setup with Docker and Nginx"
git push origin main
```

---

## 9. Deploy on EC2

Clone the repository on your EC2 instance and install dependencies:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/app
npm install
```
Inside the react-web-push/app/ run: 

```bash
npm install
```

> This installs all dependencies required to build the project.

---

## 10. Build React App

Inside the react-web-push/app/ run the build command to generate the production-ready files in `dist/`:

```bash
npm run build
```

> Example: `dist/index.html` and other static assets are now ready to be served by Nginx.

---

## 11. Start Docker Containers

Start Nginx and Certbot containers to serve your app and handle SSL.

```bash
docker compose up -d
```

> Nginx may restart if SSL certificates are missing. This is normal at this stage.

---

## 12. Generate SSL Certificates

Run Certbot manually to create SSL certificates:

```bash
sudo docker run -it --rm \
  -p 80:80 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  certbot/certbot:latest certonly --standalone -d main-domain-example.online
```

> Check `/etc/letsencrypt/live/main-domain-example.online/` to verify that `fullchain.pem` and `privkey.pem` exist.

---

## 13. Restart Docker Containers

After SSL certificates are in place, restart Docker containers to apply them.

```bash
docker compose up -d
```

> If there are issues with volume paths, remove old images and rebuild containers with `docker compose build --no-cache`.

---

Your React/Vite site is now deployed on EC2 with Nginx and secured with SSL certificates using Certbot.

