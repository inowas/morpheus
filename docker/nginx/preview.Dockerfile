FROM nginx:1.18-alpine AS base

RUN set -x ; \
  addgroup -g 1000 -S www-data ; \
  adduser -u 1000 -D -S -G www-data www-data && exit 0 ; exit 1

COPY docker/nginx/conf.d /etc/nginx/conf.d
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

FROM node:16-alpine AS builder-preview

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ARG NODE_OPTIONS="--max-old-space-size=2500"

COPY . /app
RUN cd /app && npm config set legacy-peer-deps true && npm install && npm run build-preview && npm run build-storybook

FROM base AS preview
COPY --from=builder-preview --chown=www-data /app/dist/ /usr/share/nginx/html

FROM node:16-alpine AS builder

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

ARG NODE_OPTIONS="--max-old-space-size=2500"

COPY . /app
RUN cd /app && npm config set legacy-peer-deps true && npm install && npm run build
