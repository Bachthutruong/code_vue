#!/bin/bash

docker system prune -a -f
BRANCH="$(git rev-parse --abbrev-ref HEAD)"
 echo "$BRANCH"
if [[ "$BRANCH" == "production" ]]; then
  echo "build production"
  git pull origin production
  cp .env.production .env && cd docker && docker-compose  up -d --build
  echo "build production done"
  exit 1;
fi

if [[ "$BRANCH" == "dev" ]]; then
  echo "build dev"
  git pull origin dev
  cp .env.development .env && cd docker && docker-compose  up -d --build
  echo "build dev done"
  exit 1;
fi
