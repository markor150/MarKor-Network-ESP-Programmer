alert("app.js loaded");
alert("app.js loaded");
const log = document.getElementById("log");
const programmers = document.getElementById("programmers");

function println(text) {
    log.textContent += text + "\n";
}

async function loadProgrammers() {
    programmers.innerHTML = "";

    try {
        const response = await fetch("/programmers");
        const list = await response.json();

        list.forEach(p => {
            const option = document.createElement("option");
            option.value = JSON.stringify(p);
            option.textContent = `${p.name} (${p.host}:${p.port})`;
            programmers.appendChild(option);
        });

        println(`Loaded ${list.length} programmer(s)`);
    } catch (e) {
        println("ERROR: " + e);
    }
}

async function addProgrammer() {
    println("Adding programmer...");

    const body = {
        name: document.getElementById("name").value.trim(),
        host: document.getElementById("host").value.trim(),
        port: Number(document.getElementById("port").value)
    };

    try {
        const response = await fetch("/programmers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        println("Added:");
        println(JSON.stringify(result));

        await loadProgrammers();

    } catch (e) {
        println("ERROR: " + e);
    }
}

async function chipid() {

    if (programmers.selectedIndex < 0) {
        println("No programmer selected");
        return;
    }

    const p = JSON.parse(programmers.value);

    const response =
        await fetch(`/chipid?host=${p.host}&port=${p.port}`);

    const result = await response.json();

    log.textContent = result.stdout || "";

    if (result.stderr)
        log.textContent += "\n" + result.stderr;
}

async function flashFirmware() {

    println("Flash not implemented yet.");
}

document
    .getElementById("refresh")
    .addEventListener("click", loadProgrammers);

document
    .getElementById("add")
    .addEventListener("click", addProgrammer);

document
    .getElementById("chipid")
    .addEventListener("click", chipid);

document
    .getElementById("flash")
    .addEventListener("click", flashFirmware);

loadProgrammers();
