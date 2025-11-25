# React/Vite Deployment Tutorial with Docker, Nginx, and SSL

This tutorial will guide you step-by-step through deploying a React/Vite project on an EC2 instance using Docker, Nginx, and Certbot for SSL certificates.

---

## Table of Contents

1. [Git Repository Setup](#git-repository-setup)
2. [Project Structure](#project-structure)
3. [React/Vite App Setup](#reactvite-app-setup)
4. [EC2 Instance Setup](#ec2-instance-setup)
5. [Docker Compose Configuration](#docker-compose-configuration)
6. [Nginx Configuration](#nginx-configuration)
7. [Push to Git](#push-to-git)
8. [Deploy on EC2](#deploy-on-ec2)
9. [Build React App](#build-react-app)
10. [Start Docker Containers](#start-docker-containers)
11. [Generate SSL Certificates](#generate-ssl-certificates)
12. [Restart Docker Containers](#restart-docker-containers)

---

## 1. Git Repository Setup

1. Create a new repository on GitHub (or any Git provider).
2. Clone the repository locally:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

## 2. Project Structure

Create the following folder structure:

```
project-root/
│
├── app/       # React/Vite application
├── nginx/     # Nginx configuration files
└── docker-compose.yml
```

## 3. React/Vite App Setup

Inside the `app/` folder, ensure you have a valid `package.json` for Vite:

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

> The `build` script is essential for generating the minimal production bundle in the `dist/` folder.

## 4. EC2 Instance Setup

1. Launch an EC2 instance with Ubuntu.
2. Connect to the instance via SSH:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. Update and upgrade packages:

```bash
sudo apt update && sudo apt upgrade -y
```

4. Install Docker using the official installation script:

```
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```


## 5. Docker Compose Configuration

Create `docker-compose.yml` in the project root:

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

## 6. Nginx Configuration

Update `nginx/default.conf` with your server and SSL settings. Example:

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

## 7. Push to Git

Once the project is configured, push it to your repository:

```bash
git add .
git commit -m "Initial project setup"
git push origin main
```

## 8. Deploy on EC2

1. Clone the repository on your EC2 instance:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/app
```

2. Install dependencies:

```bash
npm install
```

## 9. Build React App

Run the build command to generate the production-ready files in `dist/`:

```bash
npm run build
```

> This step is critical because Certbot needs to verify the domain by placing temporary files in `dist/`.

## 10. Start Docker Containers

From the project root:

```bash
docker compose up -d
```

> Nginx may restart repeatedly if SSL certificates are not yet available.

## 11. Generate SSL Certificates

Stop the Nginx container and run Certbot manually to generate SSL certificates:

```bash
sudo docker run -it --rm \
  -p 80:80 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  certbot/certbot:latest certonly --standalone -d main-domain-example.online
```

Verify that certificates were created in `/etc/letsencrypt/live/main-domain-example.online/`.

## 12. Restart Docker Containers

After SSL certificates are created:

```bash
docker compose up -d
```

> If there are any volume path changes, remove the old images and rebuild them.

---

Your React/Vite site is now deployed with Nginx and secured with SSL using Certbot.

