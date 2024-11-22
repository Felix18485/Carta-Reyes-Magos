let container = document.getElementById("container");
let selectUsuario = document.getElementById("selectUsuarios");
let selectReyes = document.getElementById("selectReyes");
let inputBuscador = document.getElementById("buscador");

async function obtenerUsuarios() {
    try {
        // Hacemos la petición usando fetch con async y await
        const response = await fetch("http://127.0.0.1:8000/usuarios/");

        // Validación de la respuesta HTTP
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();
        console.log(data);

        data.forEach(element => {
            let option = document.createElement("option");
            option.textContent = element.nombre;
            selectUsuario.append(option);
        });
        //crearCarta();
    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

async function obtenerReyes() {

    try {
        // Hacemos la petición usando fetch con async y await
        const response = await fetch("http://127.0.0.1:8000/reyes_magos/");

        // Validación de la respuesta HTTP
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();
        data.forEach(element => {
            let option = document.createElement("option");
            option.textContent = element.nombre;
            selectReyes.append(option);
        });
        console.log(data);
        // crearCarta();
    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

async function obtenerJuguetes() {

    try {
        // Hacemos la petición usando fetch con async y await
        const response = await fetch("http://127.0.0.1:8000/juguetes/");

        // Validación de la respuesta HTTP
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();

        crearListaJuguetes(data);
        console.log(data);

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

async function crearCarta() {
    if (selectReyes.value != "---" && selectUsuario.value != "---") {
        let contenedorCarta = document.getElementById("cartaContainer");
        contenedorCarta.innerHTML = "";
        try {
            // Hacemos la petición usando fetch con async y await
            const response = await fetch("http://127.0.0.1:8000/usuarios/");

            // Validación de la respuesta HTTP
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }

            // Convertimos la respuesta a JSON
            const data = await response.json();
            data.forEach(element => {
                if (element.nombre === selectUsuario.value) {
                    let parrafo = document.createElement("p");
                    parrafo.textContent = "Querido " + selectReyes.value + " Soy " + selectUsuario.value + " y tengo " + element.edad + " años. Me gustaria ";
                    contenedorCarta.append(parrafo);
                }
            });
        } catch (error) {
            // Capturamos y mostramos el error
            console.error("Error");
        }
    }
}

function crearListaJuguetes(data) {
    let contenedor = document.getElementById("juguetesContainer");
    contenedor.innerHTML = "";
    if (inputBuscador.value != "") {
        data.forEach(element => {
            if (element.nombre.toLowerCase().includes(inputBuscador.value.toLowerCase())) {
                let parrafo = document.createElement("p");
                parrafo.textContent = element.nombre;
                let imagen = document.createElement("img");
                imagen.setAttribute("src", "../img/" + element.imagen);
                let btnAdd = document.createElement("button");
                btnAdd.textContent = "Add";
                btnAdd.addEventListener("click", () => {
                    let btnEliminar = document.createElement("button");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.addEventListener("click", () => {
                        document.getElementById("cartaContainer").removeChild(imagenCarta);
                        document.getElementById("cartaContainer").removeChild(btnEliminar);
                    })
                    let imagenCarta = document.createElement("img");
                    imagenCarta.setAttribute("id", element.id);
                    imagenCarta.setAttribute("src", "../img/" + element.imagen);
                    document.getElementById("cartaContainer").append(imagenCarta, btnEliminar);
                })
                contenedor.append(parrafo, imagen, btnAdd);
            }
        });
    } else {
        contenedor.innerHTML = "";
    }
}

async function enviarCarta() {
    try {
        // Hacemos la petición usando fetch con async y await
        const response = await fetch("http://127.0.0.1:8000/usuarios/");
        const responseReyes = await fetch("http://127.0.0.1:8000/reyes_magos/");

        // Validación de la respuesta HTTP
        if (!response.ok || !responseReyes.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();
        const dataReyes = await responseReyes.json();

        let idUsuario = 0;
        let idReyes = 0;
        let idJuguetes = [];

        data.forEach(element => {
            if (element.nombre === selectUsuario.value) {
                idUsuario = parseInt(element.id);
            }
        });

        dataReyes.forEach(element => {
            if (element.nombre === selectReyes.value) {
                idReyes = parseInt(element.id);
            }
        });


        let juguetes = document.getElementById("cartaContainer").querySelectorAll("img");
        juguetes.forEach(element => {
            idJuguetes.push(parseInt(element.getAttribute("id")));
        });
        let body = { usuario_id: idUsuario, rey_mago_id: idReyes, juguetes_ids: idJuguetes }
        const responseCarta = await fetch("http://127.0.0.1:8000/cartas/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        if (!responseCarta.ok) {
            throw new Error('Error en la solicitud de la carta: ' + response.statusText);
        }

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

document.getElementById("crearCarta").addEventListener("click", enviarCarta);
document.getElementById("buscador").addEventListener("input", obtenerJuguetes);
obtenerUsuarios();
obtenerReyes();
selectUsuario.addEventListener("change", crearCarta);
selectReyes.addEventListener("change", crearCarta);