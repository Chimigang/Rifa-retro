const premios = [
  ...Array(60).fill('Delantal'),
  ...Array(60).fill('Tote Bag Negra'),
  ...Array(4).fill('Tote ISO Térmica'),
  ...Array(5).fill('Tula Colombia'),
  ...Array(6).fill('Tula Messi'),
  ...Array(20).fill('Bono 10% Descuento')
];
let premiosRestantes = [...premios];
let usuariosAsignados = new Set();

function registrarUsuario() {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  if (!nombre || !email) {
    alert('Completa todos los campos');
    return;
  }
  if (usuariosAsignados.size >= 300) {
    alert('Límite alcanzado');
    return;
  }
  let numero;
  do {
    numero = Math.floor(Math.random() * 300) + 1;
  } while (usuariosAsignados.has(numero));
  usuariosAsignados.add(numero);
  document.getElementById('form').classList.add('hidden');
  document.getElementById('btnGirar').classList.remove('hidden');
  document.getElementById('ruletaCanvas').classList.remove('hidden');
  iniciarRuleta(numero, nombre);
}

function iniciarRuleta(numeroGanador, nombre) {
  const canvas = document.getElementById('ruletaCanvas');
  const ctx = canvas.getContext('2d');
  const total = 300;
  const anguloPorNumero = (2 * Math.PI) / total;

  function dibujar(anguloRotacion) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < total; i++) {
      const anguloInicio = i * anguloPorNumero + anguloRotacion;
      ctx.beginPath();
      ctx.moveTo(250, 250);
      ctx.arc(250, 250, 240, anguloInicio, anguloInicio + anguloPorNumero);
      ctx.fillStyle = i % 2 === 0 ? '#ffc107' : '#f44336';
      ctx.fill();
    }
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('🎯', 240, 260);
  }

  let rotacion = 0;
  let velocidad = 0.3;
  const audioTension = document.getElementById('audioTension');
  audioTension.play();

  const animar = () => {
    rotacion += velocidad;
    velocidad *= 0.99;
    dibujar(rotacion);
    if (velocidad > 0.005) {
      requestAnimationFrame(animar);
    } else {
      audioTension.pause();
      audioTension.currentTime = 0;
      const ganador = Math.floor(((rotacion % (2 * Math.PI)) / (2 * Math.PI)) * total);
      const mensaje = document.getElementById('mensajeResultado');
      const resultado = (premiosRestantes.length > 0 && Math.random() < 0.3)
        ? `🎉 Felicidades ${nombre}! Ganaste ${premiosRestantes.pop()} con el número ${numeroGanador}`
        : `Gracias ${nombre}, tu número fue ${numeroGanador}. ¡Suerte la próxima!`;

      if (resultado.includes('Ganaste')) {
        document.getElementById('audioVictoria').play();
      }

      mensaje.innerText = resultado;
      document.getElementById('btnGirar').classList.add('hidden');
      document.getElementById('resultado').classList.remove('hidden');
    }
  };
  dibujar(rotacion);
}