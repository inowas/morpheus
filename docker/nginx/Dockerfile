FROM nginx:1.18-alpine

RUN set -x ; \
  addgroup -g 1000 -S www-data ; \
  adduser -u 1000 -D -S -G www-data www-data && exit 0 ; exit 1

COPY ./conf.d /etc/nginx/conf.d
COPY ./nginx.conf /etc/nginx/nginx.conf
