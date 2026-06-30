ARG BUILD_FROM
FROM ${BUILD_FROM}

RUN apk add --no-cache \
    bash \
    python3 \
    py3-pip \
    git \
    curl \
    avahi \
    avahi-tools \
    openssh-client \
    netcat-openbsd

COPY app /app

COPY rootfs /

COPY run.sh /run.sh

RUN pip3 install --break-system-packages -r /app/requirements.txt

RUN chmod +x /run.sh

CMD ["/run.sh"]
