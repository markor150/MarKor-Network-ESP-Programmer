ARG BUILD_FROM
FROM ${BUILD_FROM}

ENV LANG=C.UTF-8

RUN apk add --no-cache \
    bash \
    python3 \
    py3-pip \
    git \
    curl \
    openssh-client \
    avahi \
    avahi-tools \
    netcat-openbsd

COPY app/requirements.txt /tmp/requirements.txt

RUN pip3 install --break-system-packages \
    --no-cache-dir \
    -r /tmp/requirements.txt

COPY rootfs /
COPY app /app

RUN chmod +x /run.sh

WORKDIR /app

CMD ["/run.sh"]
