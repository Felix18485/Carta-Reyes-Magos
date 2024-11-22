let rey = document.getElementById("inputRey");
let btnCrear = document.getElementById("btnCrear");
let btnVisualizar = document.getElementById("btnVisualizar");

async function crearRey() {
    //Expresion regular que solo permite introducir los nombres de los reyes magos
    let regex = /^(Melchor|Gaspar|Baltasar)$/i;
    //Comparamos la expresion regular con el valor introducido en el input
    if (regex.test(rey.value)) {
        document.getElementById("mensaje").textContent = "";
        //Hacemos una peticion post pasandole el nombre del rey introducido en el input
        let body = { nombre: rey.value }
        try {
            const response = await fetch("http://127.0.0.1:8000/reyes_magos/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }
            console.log("exito");

        } catch (error) {
            console.error("Error");
        }
    }else{
        document.getElementById("mensaje").textContent = "El nombre introducido no es un Rey Mago";
    }
}

async function obtenerReyes() {
    //Hacemos una peticion get para obtener todos los reyes magos
    try {
        const response = await fetch("http://127.0.0.1:8000/reyes_magos/");

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();

        // Llamamos a la función que crea la tabla con los datos
        crearTabla(data);
        console.log(data);

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}


btnCrear.addEventListener("click", crearRey);
btnVisualizar.addEventListener("click", obtenerReyes);

function crearTabla(data) {
    let contenedor = document.getElementById("tabla-container");
    contenedor.innerHTML = "";
    let tabla = document.createElement("table");
    tabla.innerHTML = "";
    let thead = document.createElement("thead");
    let tdhead = document.createElement("td");
    tdhead.textContent = "Id";
    let tdhead1 = document.createElement("td");
    tdhead1.textContent = "Rey";
    let tdhead2 = document.createElement("td");
    tdhead2.textContent = "Acciones";
    thead.append(tdhead, tdhead1, tdhead2);
    data.forEach(element => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = element.id;
        let td1 = document.createElement("td");
        td1.textContent = element.nombre;
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        //Añadimos un eventListener por cada boton eliminar de la tabla
        btnEliminar.addEventListener("click", async () => {
            //Hacemos un Delete pasandole el id del rey mago
            try {
                const response = await fetch("http://127.0.0.1:8000/reyes_magos/" + element.id, {
                    method: "Delete"
                })
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error("Error");
            }
        })
        tabla.append(thead, tr, td, td1, btnEliminar);
        contenedor.append(tabla);
    });
}