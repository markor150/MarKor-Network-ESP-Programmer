import subprocess

def chip_id(host, port):
    cmd = [
        "python3",
        "-m",
        "esptool",
        "--port",
        f"rfc2217://{host}:{port}",
        "chip-id",
    ]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
    )

    return {
        "returncode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }

def flash(host, port, firmware, address="0x0"):
    cmd = [
        "python3",
        "-m",
        "esptool",
        "--port",
        f"rfc2217://{host}:{port}",
        "write-flash",
        address,
        firmware,
    ]

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
    )

    return {
        "returncode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
    }
