let selectUsuario = document.getElementById("selectUsuarios");

async function llenarSelect() {
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

document.getElementById("selectUsuarios").addEventListener("change", async () => {
    let idUsuario = 0;
    let edad = 0;
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
                idUsuario = parseInt(element.id);
                edad = parseInt(element.edad);
            }
        });

        const responseCarta = await fetch("http://127.0.0.1:8000/cartas/" + idUsuario);
        if (!responseCarta.ok) {
            document.getElementById("cartas-container").innerHTML = "";
            let mensaje = document.createElement("p");
            mensaje.textContent = "Este usuario no tiene cartas";
            document.getElementById("cartas-container").append(mensaje);
            throw new Error('Error en la solicitud: ' + responseCarta.statusText);
        }

        const dataCarta = await responseCarta.json();
        console.log(dataCarta);

        crearTabla(dataCarta, edad);

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
})

async function crearTabla(dataCarta, edad){
    
    let contenedor = document.getElementById("cartas-container");
    let contenedorCarta = document.createElement("div");
    contenedor.innerHTML = "";
    let tabla = document.createElement("table");
    tabla.innerHTML = "";
    let thead = document.createElement("thead");
    let tdhead = document.createElement("td");
    tdhead.textContent = "Id Carta";
    let tdhead1 = document.createElement("td");
    tdhead1.textContent = "Rey Mago";
    let tdhead2 = document.createElement("td");
    tdhead2.textContent = "Cantidad Juguetes";
    let thead3 = document.createElement("td");
    thead3.textContent = "Acciones";
    thead.append(tdhead, tdhead1, tdhead2, thead3);

    dataCarta.forEach(element => {
        let reyMago = "";
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = element.id;
        let td1 = document.createElement("td");
        switch (element.rey_mago_id) {
            case (1):
                reyMago = "Melchor"
                break
            case (2):
                reyMago = "Gaspar"
                break
            case (3):
                reyMago = "Baltasar"
                break
        }
        td1.textContent = reyMago;
        let td2 = document.createElement("td");
        td2.textContent = element.juguetes_ids.length;
        let btnVisualizar = document.createElement("button");
        btnVisualizar.textContent = "Visualizar";
        btnVisualizar.addEventListener("click", () => {
            contenedorCarta.innerHTML = "";
            let parrafo = document.createElement("p");
            parrafo.setAttribute("id", "parrafo");
            parrafo.textContent = "Querido " + reyMago + " Soy " + selectUsuario.value + " y tengo " + edad + " años. Me gustaria ";
            contenedorCarta.append(parrafo);
            element.juguetes_ids.forEach(juguete => {
                let imagenCarta = document.createElement("img");
                imagenCarta.setAttribute("src", "../img/" + juguete.imagen);
                contenedorCarta.append(imagenCarta);
            })
        })
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/cartas/" + element.id, {
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
        tabla.append(thead, tr, td, td1, td2, btnEliminar, btnVisualizar);
        contenedor.append(tabla,contenedorCarta);
        document.getElementById("btnOrdenar").addEventListener("click", () => {
            // Ordenar las cartas por la cantidad de juguetes de mayor a menor
            dataCarta.sort((a, b) => b.juguetes_ids.length - a.juguetes_ids.length);

            // Limpiar el contenedor de cartas y volver a generar la tabla ordenada
            contenedor.innerHTML = "";
            contenedor.append(crearTabla(dataCarta), contenedorCarta);
        });
    });
}
llenarSelect();