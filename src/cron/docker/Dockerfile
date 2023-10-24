FROM alpine:3.18
MAINTAINER Ralf Junghanns <ralf.junghanns@tu-dresden.de>

# Install required packages
RUN apk add --update --no-cache bash && \
    apk add --update --no-cache docker && \
    echo "*/5     *       *       *       *       run-parts /etc/periodic/5min" >> /etc/crontabs/root

#show all run-parts
RUN crontab -l

WORKDIR /
