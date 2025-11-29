#!/bin/sh
set -e

echo "Gerando env.js com envsubst..."
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

exec "$@"
