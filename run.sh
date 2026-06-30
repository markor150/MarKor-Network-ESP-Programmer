#!/usr/bin/with-contenv bashio

bashio::log.info "===================================="
bashio::log.info " MarKor Network ESP Programmer"
bashio::log.info "===================================="

python3 --version
esptool version
esphome version

cd /app

exec python3 main.py
