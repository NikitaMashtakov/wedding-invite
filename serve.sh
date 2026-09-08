#!/usr/bin/env bash
# Локальный запуск приглашения.
# Открывать через http:// обязательно — все пути в шаблоне абсолютные (/sitemaker/...),
# по file:// они не разрешатся.
set -euo pipefail
PORT="${1:-8000}"
cd "$(dirname "$0")"
echo "Приглашение: http://localhost:${PORT}/"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
