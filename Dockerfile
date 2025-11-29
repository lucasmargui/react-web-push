FROM node:20-alpine AS build
WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY app/ ./
RUN npm run build

# Essa etapa só entrega o resultado do build
FROM alpine
WORKDIR /app
COPY --from=build /app/dist ./dist

CMD ["sh", "-c", "cp -r /app/dist/* /deploy && echo 'Build copiado para /deploy' && tail -f /dev/null"]
