#!/usr/bin/with-contenv bashio

bashio::log.info "======================================"
bashio::log.info " MarKor Network ESP Programmer"
bashio::log.info "======================================"

echo
python3 --version
esptool.py version
esphome version
echo

exec python3 /app/main.py
