import os
from aiohttp import web
from esptool_api import chip_id, flash
from storage import load, save
from zeroconf import Zeroconf, ServiceBrowser
import socket
import threading
import time

programmers = load()

class Listener:
    def add_service(self, zc, service_type, name):
        info = zc.get_service_info(service_type, name)
        if not info:
            return

        host = socket.inet_ntoa(info.addresses[0])
        item = {
            "name": name,
            "host": host,
            "port": info.port,
        }

        if item not in programmers:
            programmers.append(item)
            save(programmers)
            print("Found:", item)

    def update_service(self, *args):
        pass

    def remove_service(self, *args):
        pass


def mdns_worker():
    zc = Zeroconf()
    ServiceBrowser(zc, "_rfc2217._tcp.local.", Listener())

    while True:
        time.sleep(60)


threading.Thread(target=mdns_worker, daemon=True).start()

routes = web.RouteTableDef()


@routes.get("/")
async def index(request):
    return web.FileResponse(
        os.path.join(
            os.path.dirname(__file__),
            "static",
            "index.html"
        )
    )


@routes.get("/programmers")
async def list_programmers(request):
    return web.json_response(programmers)




@routes.get("/chipid")
async def get_chipid(request):
    host = request.query.get("host")
    port = request.query.get("port")

    if not host or not port:
        return web.json_response(
            {"error": "host and port required"},
            status=400
        )

    result = chip_id(host, int(port))
    return web.json_response(result)




@routes.post("/flash")
async def flash_endpoint(request):
    data = await request.post()

    host = data["host"]
    port = int(data["port"])
    address = data.get("address", "0x0")

    firmware = data["firmware"]

    path = f"/tmp/{firmware.filename}"

    with open(path, "wb") as f:
        f.write(firmware.file.read())

    result = flash(host, port, path, address)

    return web.json_response(result)



@routes.post("/programmers")
async def add_programmer(request):

    data = await request.json()

    item = {
        "name": data["name"],
        "host": data["host"],
        "port": int(data["port"]),
    }

    if item not in programmers:
        programmers.append(item)
        save(programmers)

    return web.json_response(item)

app = web.Application()
app.router.add_static("/static", os.path.join(os.path.dirname(__file__), "static"))
app.add_routes(routes)

web.run_app(app, host="0.0.0.0", port=8099)

