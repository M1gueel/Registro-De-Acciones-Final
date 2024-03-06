const guardarAccion = () => {
    const nombreAccion = document.getElementById('nombre').value;
    const fechaCompra = document.getElementById('fechaCompra').value;
    const precioCompra = document.getElementById('precioCompra').value;
    const cantidadAcciones = document.getElementById('cantidad').value;

    fetch('/guardar-accion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombreAccion,
            fechaCompra: fechaCompra,
            precioCompra: precioCompra,
            cantidad: cantidadAcciones
        })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Limpiar los campos del formulario después de guardar la acción
        document.getElementById('nombre').value = '';
        document.getElementById('fechaCompra').value = '';
        document.getElementById('precioCompra').value = '';
        document.getElementById('cantidad').value = '';
        // Actualizar la tabla de acciones
        obtenerYActualizarAcciones();
    })
    .catch(error => console.error('Error al guardar la acción: ', error));
};

// Eliminar el último registro de la tabla de acciones
const eliminarUltimoRegistro = () => {
    fetch('/eliminar-ultimo-registro', {
        method: 'DELETE'
    })    
    .then(response => response.text())
    .then(data => {
        console.log('Respuesta del servidor:', data); // Verificar la respuesta del servidor
        // Actualizar la tabla de acciones
        obtenerYActualizarAcciones();
    })
    .catch(error => console.error('Error al eliminar el último registro: ', error));
};

// Asociar eventos de clic al botón de guardar y al botón de eliminar el último registro
document.getElementById('botonGuardar').addEventListener('click', guardarAccion);
document.getElementById('eliminarUltimoRegistro').addEventListener('click', eliminarUltimoRegistro);


// Función para formatear la fecha en el formato deseado (YYYY-MM-DD)
const formatearFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    let month = fechaObj.getMonth() + 1;
    month = month < 10 ? '0' + month : month; // Agregar un 0 al mes si es necesario
    let day = fechaObj.getDate();
    day = day < 10 ? '0' + day : day; // Agregar un 0 al día si es necesario
    return `${year}-${month}-${day}`;
};

// Función para obtener y actualizar las acciones en la tabla
const obtenerYActualizarAcciones = () => {
    fetch('/acciones')
    .then(response => response.json())
    .then(data => {
        const accionesTableBody = document.querySelector('#acciones-table tbody');
        accionesTableBody.innerHTML = ''; // Limpiar la tabla antes de actualizarla

        data.forEach(accion => {
            const row = document.createElement('tr');
            const costoTotal = accion.precioCompra * accion.cantidad; // Calcular el costo total
            row.innerHTML = `
                <td>${accion.nombre}</td>
                <td>${formatearFecha(accion.fechaCompra)}</td>
                <td>${accion.precioCompra}</td>
                <td>${accion.cantidad}</td>
                <td>${costoTotal}</td>

            `;
            accionesTableBody.appendChild(row);
        });

        // Agrega un evento de clic al documento y delega el evento al botón de eliminar
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('eliminar-accion')) {
                const idAccion = event.target.dataset.id;
                eliminarAccion(idAccion);
            }
        });
    })
    .catch(error => console.error('Error al obtener las acciones: ', error));
};


// Función para ordenar acciones por precio de forma descendente
const ordenarPorPrecio = () => {
    const acciones = [...document.querySelectorAll('#acciones-table tbody tr')];
    acciones.sort((a, b) => {
        const precioA = parseFloat(a.querySelector('td:nth-child(3)').innerText);
        const precioB = parseFloat(b.querySelector('td:nth-child(3)').innerText);
        return precioB - precioA;
    });
    const accionesTableBody = document.querySelector('#acciones-table tbody');
    acciones.forEach(accion => accionesTableBody.appendChild(accion));
};

// Función para ordenar acciones por fecha de forma descendente
const ordenarPorFecha = () => {
    const acciones = [...document.querySelectorAll('#acciones-table tbody tr')];
    acciones.sort((a, b) => {
        const fechaA = new Date(a.querySelector('td:nth-child(2)').innerText);
        const fechaB = new Date(b.querySelector('td:nth-child(2)').innerText);
        return fechaB - fechaA;
    });
    const accionesTableBody = document.querySelector('#acciones-table tbody');
    acciones.forEach(accion => accionesTableBody.appendChild(accion));
};

// Asociar eventos de clic a los botones de ordenamiento
document.getElementById('ordenarPorPrecio').addEventListener('click', ordenarPorPrecio);
document.getElementById('ordenarPorFecha').addEventListener('click', ordenarPorFecha);



// Función para buscar el precio de una acción
const buscarPrecioAccion = () => {
    const symbol = document.getElementById('symbol').value;

    fetch(`/precio-accion?symbol=${symbol}`)
        .then(response => response.json())
        .then(data => {
            const precioAccionBody = document.getElementById('precio-accion-body');
            precioAccionBody.innerHTML = ''; // Limpiar el cuerpo de la tabla antes de agregar nuevas filas

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${symbol}</td>
                <td>${data.price}</td>
            `;
            precioAccionBody.appendChild(row);
        })
        .catch(error => console.error('Error al buscar el precio de la acción:', error));
};




// Asocia la función buscarPrecioAccion a un evento de clic en el botón de buscar
document.getElementById('botonBuscar').addEventListener('click', buscarPrecioAccion);

// Asocia la función guardarAccion a un evento de clic en el botón de guardar
document.getElementById('botonGuardar').addEventListener('click', guardarAccion);

// Al cargar la página, obtener y actualizar las acciones en la tabla
document.addEventListener('DOMContentLoaded', obtenerYActualizarAcciones);
