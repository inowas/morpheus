FROM node:20-alpine AS builder

WORKDIR /app/

COPY ./frontend .

RUN set -x \
    && apk update \
    && apk upgrade \
    && apk add --no-cache \
    chromium git
RUN npm ci --legacy-peer-deps
RUN npm run build

FROM nginx:1.23.2-alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
