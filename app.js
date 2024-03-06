const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
const port = 3000;

// Configura el middleware de análisis de cuerpos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors());

const connection = mysql.createConnection({
    host: 'db',
    user: 'miguel',
    password: '1234',
    database: 'registro_acciones'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Ruta para eliminar el último registro de la tabla de acciones
app.delete('/eliminar-ultimo-registro', (req, res) => {
    const sql = 'DELETE FROM acciones ORDER BY id DESC LIMIT 1'; // Elimina el último registro

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error al eliminar el último registro: ', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Último registro eliminado correctamente de la base de datos');
        res.status(200).send('Último registro eliminado correctamente');
    });
});


// Ruta para eliminar el último registro de la tabla de acciones
app.delete('/eliminar-ultimo-registro', (req, res) => {
    const sql = 'DELETE FROM acciones ORDER BY id DESC LIMIT 1'; // Elimina el último registro

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error al eliminar el último registro: ', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Último registro eliminado correctamente de la base de datos');
        res.status(200).send('Último registro eliminado correctamente');
    });
});

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener todas las acciones
app.get('/acciones', (req, res) => {
    const sql = 'SELECT *, precioCompra * cantidad AS costoTotal FROM acciones'; // Calcula el costo total

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error al obtener acciones: ', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Acciones obtenidas correctamente de la base de datos');
        res.json(result); // Envia los datos como JSON
    });
});

// Ruta para guardar una nueva acción
app.post('/guardar-accion', (req, res) => {
    const { nombre, fechaCompra, precioCompra, cantidad } = req.body;

    // Realiza la inserción en la base de datos
    const sql = `INSERT INTO acciones (nombre, fechaCompra, precioCompra, cantidad) VALUES (?, ?, ?, ?)`;
    const values = [nombre, fechaCompra, precioCompra, cantidad];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al guardar la acción: ', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        console.log('Acción guardada correctamente en la base de datos');
        res.status(200).send('Acción guardada correctamente');
    });
});

// Ruta para obtener el precio de una acción desde Alpha Vantage
app.get('/precio-accion', async (req, res) => {
    try {
        const { symbol } = req.query;
        const apiKey = 'T78OOPF0LPI8R7V34'; // Reemplaza 'TU_CLAVE_DE_API' con tu clave de API de Alpha Vantage

        const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data['Global Quote']) {
            const price = data['Global Quote']['05. price'];
            res.json({ price });
        } else {
            throw new Error('No se encontraron datos para el símbolo de la acción especificada.');
        }
    } catch (error) {
        console.error('Error al obtener el precio de la acción:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});


// Inicia el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
