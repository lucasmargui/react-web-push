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

# copiar arquivo de template para ser processado depois
COPY config/env.template.js /usr/share/nginx/html/env.template.js

# entrypoint que gera env.js dinamicamente
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
