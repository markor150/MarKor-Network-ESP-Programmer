import json

OPTIONS_FILE = "/data/options.json"

def load_programmers():
    try:
        with open(OPTIONS_FILE, "r") as f:
            options = json.load(f)
        return options.get("programmers", [])
    except Exception:
        return []
