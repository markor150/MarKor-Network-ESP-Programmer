import json
import os

DATA_FILE = "/data/programmers.json"


def load():
    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save(programmers):
    os.makedirs("/data", exist_ok=True)

    with open(DATA_FILE, "w") as f:
        json.dump(programmers, f, indent=2)
