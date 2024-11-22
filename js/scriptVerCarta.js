let selectUsuario = document.getElementById("selectUsuarios");

async function llenarSelect() {
    //Hacemos una peticion GET para obtener todos los usuarios
    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/");

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        console.log(data);

        //Rellenamos el select de manera dinamica con los usuarios que hay en la base de datos
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

//Funcion que se ejecutara con cada cambio en el select
document.getElementById("selectUsuarios").addEventListener("change", async () => {
    let idUsuario = 0;
    let edad = 0;
    try {
        //Hacemos una peticion GET para obtener todos los usuarios
        const response = await fetch("http://127.0.0.1:8000/usuarios/");

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const data = await response.json();
        //Comparamos el nombre del usuario con el seleccionado.
        //En caso afirmativo se almacena el id del usuario y su edad
        data.forEach(element => {
            if (element.nombre === selectUsuario.value) {
                idUsuario = parseInt(element.id);
                edad = parseInt(element.edad);
            }
        });

        //Hacemos una peticion GET para obtener todas las cartas
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

        //Funcion que se encargara de crear la tabla
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
        //Añadimos un eventListener por cada boton de visualizar
        btnVisualizar.addEventListener("click", () => {
            contenedorCarta.innerHTML = "";
            let parrafo = document.createElement("p");
            parrafo.setAttribute("id", "parrafo");
            //Mostramos la carta con la informacion almacenada previamente del rey mago, el nombre del usuario y la edad
            parrafo.textContent = "Querido " + reyMago + " Soy " + selectUsuario.value + " y tengo " + edad + " años. Me gustaria ";
            contenedorCarta.append(parrafo);
            //Recorremos el array de juguetes
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