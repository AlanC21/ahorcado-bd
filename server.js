const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'score'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos');
    }
});

// Ruta para obtener puntuaciones
app.get('/scores', (req, res) => {
    db.query('SELECT * FROM score ORDER BY puntos DESC', (err, results) => {
        if (err) {
            console.error('Error al obtener puntuaciones:', err);
            res.status(500).send('Error al obtener puntuaciones');
        } else {
            res.json(results);
        }
    });
});

// Ruta para guardar puntuaciones
app.post('/scores', (req, res) => {
    const { tiempo, puntos, nombre } = req.body;
    db.query('INSERT INTO score (tiempo, puntos, nombre) VALUES (?, ?, ?)', [tiempo, puntos, nombre], (err, result) => {
        if (err) {
            console.error('Error al guardar puntuación:', err);
            res.status(500).send('Error al guardar puntuación');
        } else {
            res.sendStatus(200);
        }
    });
});

// Ruta para servir el archivo HTML principal
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
