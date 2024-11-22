let juguete = document.getElementById("inputJuguete");
let imagen = document.getElementById("inputImagen");
let btnCrear = document.getElementById("btnCrear");
let btnVisualizar = document.getElementById("btnVisualizar");
console.log(imagen.value);

async function crearJuguete() {
    console.log(imagen.value);
    if (juguete.value != "" && imagen.value != "") {
        document.getElementById("mensaje").textContent = "";
        let body = { nombre: juguete.value, imagen: imagen.files[0].name }
        try {
            const response = await fetch("http://127.0.0.1:8000/juguetes/", {
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
        document.getElementById("mensaje").textContent = "El nombre y la imagen no pueden estar vacios";
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

        crearTabla(data);
        console.log(data);

    } catch (error) {
        // Capturamos y mostramos el error
        console.error("Error");
    }
}

btnCrear.addEventListener("click", crearJuguete);
btnVisualizar.addEventListener("click", obtenerJuguetes);

function crearTabla(data) {
    let contenedor = document.getElementById("tabla-container");
    contenedor.innerHTML = "";
    let tabla = document.createElement("table");
    tabla.innerHTML = "";
    let thead = document.createElement("thead");
    let tdhead = document.createElement("td");
    tdhead.textContent = "Nombre";
    let tdhead1 = document.createElement("td");
    tdhead1.textContent = "Imagen";
    let tdhead2 = document.createElement("td");
    tdhead2.textContent = "Acciones";
    thead.append(tdhead, tdhead1, tdhead2);
    data.forEach(element => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = element.nombre;
        let td1 = document.createElement("td");
        let img = document.createElement("img");
        img.setAttribute("src", "../img/" + element.imagen);
        td1.append(img);
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", async () => {
            try {
                console.log(element.id)
                const response = await fetch("http://127.0.0.1:8000/juguetes/" + element.id, {
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

juguete.addEventListener("input", (event) => {
    //Expresion regular que permite cualquier tipo de caracter pero 
    //solo un maximo de 20 caracteres
    let regex = /^.{0,20}$/;
    if (!regex.test(event.target.value)) {
        alert("El titulo no puede tener mas de 20 caracteres");
        //En el caso de que hay mas de 20 caracteres se elimina el ultimo caracter
        //y se actualiza el valor del input
        let inputModificado = event.target.value.substring(0, event.target.value.length - 1);
        event.target.value = inputModificado;
    }
})