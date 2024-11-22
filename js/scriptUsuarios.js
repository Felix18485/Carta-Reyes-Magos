let usuario = document.getElementById("inputUsuario");
let edad = document.getElementById("inputEdad");
let btnCrear = document.getElementById("btnCrear");
let btnVisualizar = document.getElementById("btnVisualizar");

async function crearUsuario() {
    let regex = /^(0|[1-9]|1[0-5])$/;
    if (regex.test(edad.value) && usuario.value != "") {
        let body = { nombre: usuario.value, edad: edad.value }
        try {
            const response = await fetch("http://127.0.0.1:8000/usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            })
            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            } else {
                document.getElementById("mensaje").textContent = "Usuario creado correctamente";
            }
            console.log("exito");

        } catch (error) {
            console.error("Error");
        }
    }else{
        document.getElementById("mensaje").textContent = "El nombre no puede estar vacio y la edad introducida debe ser entre 0 y 15";
    }
}

async function obtenerUsuarios() {
    document.getElementById("mensaje").textContent = "";
    try {
        // Hacemos la petición usando fetch con async y await
        const response = await fetch("http://127.0.0.1:8000/usuarios/");

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


function crearTabla(data) {
    let contenedor = document.getElementById("tabla-container");
    contenedor.innerHTML = "";
    let tabla = document.createElement("table");
    tabla.innerHTML = "";
    let thead = document.createElement("thead");
    let tdhead = document.createElement("td");
    tdhead.textContent = "Usuario";
    let tdhead1 = document.createElement("td");
    tdhead1.textContent = "Edad";
    let tdhead2 = document.createElement("td");
    tdhead2.textContent = "Acciones";
    thead.append(tdhead, tdhead1, tdhead2);
    data.forEach(element => {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = element.nombre;
        let td1 = document.createElement("td");
        td1.textContent = element.edad;
        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/usuarios/" + element.id, {
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

usuario.addEventListener("input", (event) => {
    //Expresion regular que permite cualquier tipo de caracter pero 
    //solo un maximo de 10 caracteres
    let regex = /^.{0,10}$/;
    if (!regex.test(event.target.value)) {
        alert("El titulo no puede tener mas de 10 caracteres");
        //En el caso de que hay mas de 10 caracteres se elimina el ultimo caracter
        //y se actualiza el valor del input
        let inputModificado = event.target.value.substring(0, event.target.value.length - 1);
        event.target.value = inputModificado;
    }
})

btnCrear.addEventListener("click", crearUsuario);
btnVisualizar.addEventListener("click", obtenerUsuarios);