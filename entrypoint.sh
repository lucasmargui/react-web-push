#!/bin/sh
# Substitui placeholder no env.js
echo "Substituindo variáveis de ambiente..."
sed -i "s|__VITE_API_URL__|$VITE_API_URL|g" /usr/share/nginx/html/env.js

# Inicia Nginx
echo "Iniciando Nginx..."
nginx -g "daemon off;"
