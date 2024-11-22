let container = document.getElementById("container");
let selectUsuario = document.getElementById("selectUsuarios");
let selectReyes = document.getElementById("selectReyes");
let inputBuscador = document.getElementById("buscador");

async function obtenerUsuarios() {
    //Hacemos una peticion GET para obtener todos los usuarios
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

        //Rellenamos el select de manera dinamica con cada uno de los usuarios
        data.forEach(element => {
            let option = document.createElement("option");
            option.textContent = element.nombre;
            selectUsuario.append(option);
        });
    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

async function obtenerReyes() {
    //Hacemos una peticion GET para obtener todos los reyes magos
    try {
        const response = await fetch("http://127.0.0.1:8000/reyes_magos/");

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        //Rellenamos el select de manera dinamica con cada uno de los reyes magos
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
    //Hacemos una peticion GET para obtener todos los jugetes
    try {
        // Hacemos la petición usando fetch con async y await
        const response = await fetch("http://127.0.0.1:8000/juguetes/");

        // Validación de la respuesta HTTP
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Convertimos la respuesta a JSON
        const data = await response.json();

        //Llamamos a la funcion para crear la lista de juguetes
        crearListaJuguetes(data);
        console.log(data);

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

//Funcion que se ejecutara cada vez que se cambie un usuario en el select
async function crearCarta() {
    //Comprobamos que se haya seleccionado un usuario valido
    if (selectReyes.value != "---" && selectUsuario.value != "---") {
        let contenedorCarta = document.getElementById("cartaContainer");
        contenedorCarta.innerHTML = "";
        //Hacemos una peticion GET para obtener todos los usuarios
        try {
            const response = await fetch("http://127.0.0.1:8000/usuarios/");

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.statusText);
            }

            const data = await response.json();
            data.forEach(element => {
                //Comprobamos si el nombre del usuario seleccionado es igual al que viene de la peticion
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

//Funcion que se ejecutara con cada cambio en el input de buscar juguetes
function crearListaJuguetes(data) {
    let contenedor = document.getElementById("juguetesContainer");
    contenedor.innerHTML = "";
    if (inputBuscador.value != "") {
        //Recorremos todos los juguetes de la base de datos
        data.forEach(element => {
            //Comprobamos si el nombre del juguete contiene lo introducido por el input
            //en el caso de ser asi mostraremos los juguetes
            if (element.nombre.toLowerCase().includes(inputBuscador.value.toLowerCase())) {
                let parrafo = document.createElement("p");
                parrafo.textContent = element.nombre;
                let imagen = document.createElement("img");
                imagen.setAttribute("src", "../img/" + element.imagen);
                let btnAdd = document.createElement("button");
                btnAdd.textContent = "Add";
                //Añadimos un eventListener por cada boton añadir que tendra cada juguete
                btnAdd.addEventListener("click", () => {
                    //Cuando pulsemos el boton añadir se añadira la imagen a la carta y un boton
                    //para eliminarla de la misma
                    let btnEliminar = document.createElement("button");
                    btnEliminar.textContent = "Eliminar";
                    btnEliminar.addEventListener("click", () => {
                        //Si pulsamos el boton eliminar se eliminara el la imagen y el boton de la carta
                        document.getElementById("cartaContainer").removeChild(imagenCarta);
                        document.getElementById("cartaContainer").removeChild(btnEliminar);
                    })
                    let imagenCarta = document.createElement("img");
                    //Almacenamos el id del juguete en el atributo id de la imagen
                    imagenCarta.setAttribute("id", element.id);
                    imagenCarta.setAttribute("src", "../img/" + element.imagen);
                    document.getElementById("cartaContainer").append(imagenCarta, btnEliminar);
                })
                //Añadimos la imagen con el titulo y el boton añadir
                contenedor.append(parrafo, imagen, btnAdd);
            }
        });
    } else {
        contenedor.innerHTML = "";
    }
}

async function enviarCarta() {
    //Hacemos una peticion GET tanto para los usuarios como para los reyes magos
    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/");
        const responseReyes = await fetch("http://127.0.0.1:8000/reyes_magos/");

        if (!response.ok || !responseReyes.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        const dataReyes = await responseReyes.json();

        let idUsuario = 0;
        let idReyes = 0;
        let idJuguetes = [];

        //Recorremos los usuarios y comparamos el nombre con el del select.
        //En caso de que coincidan almacenamos su id en una variable
        data.forEach(element => {
            if (element.nombre === selectUsuario.value) {
                idUsuario = parseInt(element.id);
            }
        });

        //Recorremos los reyes y comparamos el nombre con el del select.
        //En caso de que coincidan almacenamos su id en una variable
        dataReyes.forEach(element => {
            if (element.nombre === selectReyes.value) {
                idReyes = parseInt(element.id);
            }
        });

        //Recorremos todas las imagenes que habia añadidas en la carta y guardamos su id
        //en un array
        let juguetes = document.getElementById("cartaContainer").querySelectorAll("img");
        juguetes.forEach(element => {
            idJuguetes.push(parseInt(element.getAttribute("id")));
        });
        //Hacemos una peticion POST pasando el id de usuario, de rey mago y el array de ids de juguetes
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