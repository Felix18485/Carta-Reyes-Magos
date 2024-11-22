let usuario = document.getElementById("inputUsuario");
let edad = document.getElementById("inputEdad");
let btnCrear = document.getElementById("btnCrear");
let btnVisualizar = document.getElementById("btnVisualizar");

async function crearUsuario() {
    //Comprobamos que la edad no sea mas de 15 años y que el campo usuario no este vacio
    let regex = /^(0|[1-9]|1[0-5])$/;
    if (regex.test(edad.value) && usuario.value != "") {
        //Hacemos un post pasando el nombre y edad introducida por el usuario
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
    //Hacemos una peticion GET para obtener todos los usuarios
    try {
        const response = await fetch("http://127.0.0.1:8000/usuarios/");

        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();
        //Llamamos a la funcion para crear la tabla pasandole los datos
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
        //Añadimos un eventListener a cada boton de eliminar que se creara en la tabla
        btnEliminar.addEventListener("click", async () => {
            //Haremos un Delete pasandole el id del usuario
            try {
                const response = await fetch("http://127.0.0.1:8000/usuarios/" + element.id, {
                    method: "Delete"
                })
                if (!response.ok) {
                    throw new Error("Error en la solicitud: " + response.statusText);
                }
                const data = await response.json();
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