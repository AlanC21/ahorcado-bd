// Variables globales
let palabra = '';
let palabraOculta = '';
let intentos = 6;
let puntos = 0;  // Variable para acumular puntos
const letrasUsadas = new Set();

// Elementos del DOM
const btnEmpezar = document.getElementById('btnEmpezar');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnGuardar = document.getElementById('btnGuardar');
const introduccion = document.getElementById('introduccion');
const juegoContainer = document.getElementById('juego');
const vidasRestantes = document.getElementById('vidas-restantes');
const teclaSonido = document.getElementById('tecla-sonido');

// Función para normalizar texto (quitar acentos y caracteres especiales)
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Función para obtener una palabra aleatoria
async function obtenerPalabra() {
    try {
        const respuesta = await fetch('https://random-word-api.herokuapp.com/word?lang=es');
        const [palabraAleatoria] = await respuesta.json();
        return normalizarTexto(palabraAleatoria.toUpperCase());
    } catch (error) {
        console.error('Error al obtener la palabra:', error);
        return 'PROGRAMACION'; // Palabra por defecto en caso de error
    }
}

// Función para inicializar el juego
async function iniciarJuego() {
    introduccion.style.display = 'none';
    juegoContainer.style.display = 'block';
    vidasRestantes.style.display = 'block';
    document.getElementById('formulario-nombre').style.display = 'none';
    
    palabra = await obtenerPalabra();
    palabraOculta = palabra.split('').map(letra => letra === ' ' ? ' ' : '_').join('');
    intentos = 6;
    puntos = 0;
    letrasUsadas.clear();
    
    actualizarPalabra();
    crearTeclado();
    dibujarAhorcado();
    mostrarMensaje('');
    actualizarVidasRestantes();

    document.addEventListener('keydown', manejarTeclaFisica);
}

// Función para reiniciar el juego
async function reiniciarJuego() {
    document.getElementById('formulario-nombre').style.display = 'none';
    palabra = await obtenerPalabra();
    palabraOculta = palabra.split('').map(letra => letra === ' ' ? ' ' : '_').join('');
    intentos = 6;
    puntos = 0;
    letrasUsadas.clear();
    
    actualizarPalabra();
    crearTeclado();
    dibujarAhorcado();
    mostrarMensaje('');
    actualizarVidasRestantes();

    document.addEventListener('keydown', manejarTeclaFisica);
}


// Función para actualizar la palabra oculta en la pantalla
function actualizarPalabra() {
    document.getElementById('palabra').textContent = palabraOculta;
}

// Función para crear el teclado virtual
function crearTeclado() {
    const teclado = document.getElementById('teclado');
    teclado.innerHTML = ''; // Limpiar teclado existente
    
    const letras = 'ABCDEFGHIJKLMNÑOPQRST';
    const ultimasFila = 'UVWXYZ';

    // Crear las primeras tres filas
    for (let i = 0; i < letras.length; i++) {
        const letra = letras[i];
        const boton = document.createElement('button');
        boton.textContent = letra;
        boton.className = 'tecla';
        boton.addEventListener('click', () => {
            intentarLetra(letra); 
            reproducirSonidoTecla();
        });
        teclado.appendChild(boton);
    }

    // Crear la última fila
    const ultimaFila = document.createElement('div');
    ultimaFila.className = 'ultima-fila';

    // Añadir el resto de las letras de la última fila
    for (let i = 0; i < ultimasFila.length; i++) {
        const letra = ultimasFila[i];
        const boton = document.createElement('button');
        boton.textContent = letra;
        boton.className = 'tecla';
        boton.addEventListener('click', () => {
            intentarLetra(letra);
            reproducirSonidoTecla();
        });
        ultimaFila.appendChild(boton);
    }

    teclado.appendChild(ultimaFila);
}

function reproducirSonidoTecla() {
    teclaSonido.currentTime = 0;
    teclaSonido.play();
}

// Función para manejar la tecla física presionada
function manejarTeclaFisica(event) {
    const letra = event.key.toUpperCase();
    if (/^[A-Z]$/.test(letra)) {
        intentarLetra(letra);
        reproducirSonidoTecla();
    }
}

// Función para manejar el intento de una letra
function intentarLetra(letra) {
    letra = normalizarTexto(letra);
    if (letrasUsadas.has(letra)) return;
    letrasUsadas.add(letra);

    if (normalizarTexto(palabra).includes(letra)) {
        actualizarPalabraOculta(letra);
    } else {
        intentos--;
        dibujarAhorcado();
        actualizarVidasRestantes();
    }

    actualizarPalabra();
    verificarEstadoJuego();
    deshabilitarTecla(letra);
}

// Función para actualizar el contador de vidas restantes
function actualizarVidasRestantes() {
    vidasRestantes.textContent = `Vidas restantes: ${intentos}`;
}

// Función para actualizar la palabra oculta con la letra adivinada
function actualizarPalabraOculta(letra) {
    palabraOculta = palabraOculta.split('').map((char, index) => 
        palabra[index] === letra ? letra : char
    ).join('');
    puntos += 100;  // Sumar puntos por cada letra acertada
}

// Función para verificar el estado del juego
function verificarEstadoJuego() {
    if (palabraOculta === palabra) {
        mostrarMensaje('¡Felicidades! Has ganado.');
        setTimeout(() => {
            finalizarJuego();
        }, 5000);
    } else if (intentos === 0) {
        mostrarMensaje(`Game Over. La palabra era: ${palabra}`);
        finalizarJuego();
    }
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje) {
    document.getElementById('mensaje').textContent = mensaje;
}

// Función para deshabilitar una tecla
function deshabilitarTecla(letra) {
    const teclas = document.querySelectorAll('.tecla');
    teclas.forEach(tecla => {
        if (tecla.textContent === letra) {
            tecla.disabled = true;
        }
    });
}

// Función para deshabilitar todo el teclado
function deshabilitarTeclado() {
    const teclas = document.querySelectorAll('.tecla');
    teclas.forEach(tecla => tecla.disabled = true);
}

// Función para dibujar el ahorcado
function dibujarAhorcado() {
    const canvas = document.getElementById('ahorcado');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // Dibujar base
    ctx.beginPath();
    ctx.moveTo(20, 180);
    ctx.lineTo(180, 180);
    ctx.stroke();

    // Dibujar poste
    ctx.beginPath();
    ctx.moveTo(50, 180);
    ctx.lineTo(50, 20);
    ctx.lineTo(150, 20);
    ctx.lineTo(150, 40);
    ctx.stroke();

    // Dibujar ahorcado según el número de intentos restantes
    if (intentos <= 5) {
        // Cabeza
        ctx.beginPath();
        ctx.arc(150, 60, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (intentos <= 4) {
        // Cuerpo
        ctx.beginPath();
        ctx.moveTo(150, 80);
        ctx.lineTo(150, 140);
        ctx.stroke();
    }
    if (intentos <= 3) {
        // Brazo izquierdo
        ctx.beginPath();
        ctx.moveTo(150, 100);
        ctx.lineTo(120, 110);
        ctx.stroke();
    }
    if (intentos <= 2) {
        // Brazo derecho
        ctx.beginPath();
        ctx.moveTo(150, 100);
        ctx.lineTo(180, 110);
        ctx.stroke();
    }
    if (intentos <= 1) {
        // Pierna izquierda
        ctx.beginPath();
        ctx.moveTo(150, 140);
        ctx.lineTo(120, 160);
        ctx.stroke();
    }
    if (intentos === 0) {
        // Pierna derecha
        ctx.beginPath();
        ctx.moveTo(150, 140);
        ctx.lineTo(180, 160);
        ctx.stroke();
    }
}

// Función para finalizar el juego
function finalizarJuego() {
    deshabilitarTeclado();
    document.getElementById('formulario-nombre').style.display = 'block';
    document.removeEventListener('keydown', manejarTeclaFisica);
}

// Función para guardar el puntaje en la base de datos
async function guardarPuntaje() {
    const nombre = document.getElementById('nombre').value;
    if (nombre) {
        const response = await fetch('http://localhost:3000/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tiempo: 0, puntos, nombre })
        });
        if (response.ok) {
            alert('Puntaje guardado');
            mostrarPuntuaciones();
            reiniciarJuego(); // Reiniciar el juego después de guardar el puntaje
        } else {
            alert('Error al guardar el puntaje');
        }
    }
}


// Función para mostrar las puntuaciones
async function mostrarPuntuaciones() {
    const response = await fetch('http://localhost:3000/scores');
    const puntuaciones = await response.json();
    const listaPuntuaciones = document.getElementById('lista-puntuaciones');
    listaPuntuaciones.innerHTML = '';
    puntuaciones.forEach(puntuacion => {
        const li = document.createElement('li');
        li.textContent = `${puntuacion.nombre}: ${puntuacion.puntos} puntos`;
        listaPuntuaciones.appendChild(li);
    });
}

// Event Listeners
btnEmpezar.addEventListener('click', iniciarJuego);
btnGuardar.addEventListener('click', guardarPuntaje);

document.addEventListener('DOMContentLoaded', () => {
    btnEmpezar.style.display = 'block';
    mostrarPuntuaciones(); // Mostrar las puntuaciones al cargar la página
});