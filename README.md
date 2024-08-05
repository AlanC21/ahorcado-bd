# Juego del Ahorcado

Este proyecto es un juego del ahorcado desarrollado con HTML, CSS, JavaScript y Express para el backend. El juego permite a los usuarios adivinar una palabra oculta antes de quedarse sin vidas. Los puntajes se guardan en una base de datos MySQL y se muestran en una tabla de puntuaciones.

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/) (v14 o superior recomendado)
- [MySQL](https://www.mysql.com/) (v5.7 o superior recomendado)

## Configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/AlanC21/ahorcado-bd.git
cd ahorcado-bd
```

### 2. Instala las dependencias del proyecto

Asegúrate de estar en el directorio raíz del proyecto y ejecuta:

```bash
npm install
```

### 3. Configura la base de datos

1. Crea la base de datos y la tabla:

Abre MySQL en tu terminal o usa una herramienta de administración de bases de datos como phpMyAdmin.
Ejecuta el siguiente script SQL para crear la base de datos y la tabla necesarias:

```bash
CREATE DATABASE IF NOT EXISTS score;

USE score;

CREATE TABLE IF NOT EXISTS score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiempo INT,
    puntos INT,
    nombre VARCHAR(255)
);
```

2. Configura la conexión a la base de datos en server.js:

Asegúrate de que los detalles de conexión en el archivo server.js coincidan con tu configuración de MySQL:

```bash
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'score'
});
```

### 4. Ejecuta el servidor

Para iniciar el servidor de Express, ejecuta:

```bash
npm run start
```

Esto iniciará el servidor en http://localhost:3000.

### 5. Abre el juego en tu navegador

Abre tu navegador y navega a http://localhost:3000 para jugar el juego del ahorcado.

## Estructura de Archivos
* public/: Carpeta que contiene los archivos estáticos del frontend.
        * css/: Carpeta que contiene los estilos CSS.
            * styles.css: Archivo CSS con los estilos del juego.
        * js/: Carpeta que contiene los scripts JavaScript.
            * script.js: Archivo JavaScript con la lógica del juego.
        * index.html: Archivo HTML principal del juego.
        * logo.png: Imagen para el ícono de la pestaña.
        * tecla.mp3: Archivo de sonido para las teclas.
* package-lock.json: Archivo de bloqueo de versiones de dependencias.
* package.json: Archivo de configuración de dependencias y scripts de Node.js.
* server.js: Archivo principal del servidor Express.

## Notas
* Asegúrate de que el servidor Express esté corriendo antes de intentar acceder al juego desde el navegador.
* Si necesitas cambiar la base de datos o el usuario, actualiza la configuración en server.js.

```bash
// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario de MySQL
    password: '', // Cambia esto por tu contraseña de MySQL
    database: 'score'
});
```
