const log = document.getElementById("log");
const programmers = document.getElementById("programmers");

function println(txt){
    log.textContent += txt + "\n";
}

async function loadProgrammers(){

    programmers.innerHTML = "";

    const response = await fetch("/programmers");
    const list = await response.json();

    list.forEach(p => {

        const option = document.createElement("option");

        option.value = JSON.stringify(p);
        option.textContent = `${p.name} (${p.host}:${p.port})`;

        programmers.appendChild(option);

    });

    println("Found " + list.length + " programmer(s)");
}

async function chipid(){

    if(programmers.selectedIndex < 0){
        println("No programmer selected");
        return;
    }

    const p = JSON.parse(programmers.value);

    println("Reading chip...");

    const response = await fetch(
        `/chipid?host=${p.host}&port=${p.port}`
    );

    const result = await response.json();

    log.textContent = result.stdout;

    if(result.stderr){
        log.textContent += "\n" + result.stderr;
    }

}

window.onload = loadProgrammers;

async function flashFirmware(){

    if(programmers.selectedIndex < 0){
        println("No programmer selected");
        return;
    }

    const file =
        document.getElementById("firmware").files[0];

    if(!file){
        println("Choose firmware");
        return;
    }

    const p = JSON.parse(programmers.value);

    const form = new FormData();

    form.append("host", p.host);
    form.append("port", p.port);
    form.append(
        "address",
        document.getElementById("address").value
    );
    form.append("firmware", file);

    log.textContent = "Flashing...\n";

    const response = await fetch("/flash",{
        method:"POST",
        body:form
    });

    const result = await response.json();

    log.textContent =
        result.stdout +
        "\n" +
        result.stderr;
}

async function addProgrammer(){
    println("addProgrammer() called");

    const body = {
        name: document.getElementById("name").value,
        host: document.getElementById("host").value,
        port: parseInt(document.getElementById("port").value)
    };

    const response = await fetch("/programmers",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    });

    const result = await response.json();

    println(JSON.stringify(result,null,2));

    loadProgrammers();
}

