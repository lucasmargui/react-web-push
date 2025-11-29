# Build React
FROM node:20-alpine AS build
WORKDIR /app

# instalar dependências
COPY app/package*.json ./
RUN npm install

# copiar app inteiro
COPY app/ ./

# gerar build
RUN npm run build


# ------ NGINX SERVINDO O REACT ------
FROM nginx:alpine

# copiar build final
COPY --from=build /app/dist /usr/share/nginx/html

# copiar nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY config/env.js /usr/share/nginx/html/env.js

# copiar arquivo de template para ser processado depois
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Entrypoint que injeta variáveis em runtime
ENTRYPOINT ["/entrypoint.sh"]