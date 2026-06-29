let numeroActual = 0;

function moverCarrusel(dir) {
  const imgs = document.querySelectorAll('.carrusel img');
  if (!imgs.length) return;
  imgs[numeroActual].classList.remove('activa');
  numeroActual = (numeroActual + dir + imgs.length) % imgs.length;
  imgs[numeroActual].classList.add('activa');
}

async function cargarHorarios() {
  const tbody = document.querySelector('tbody');
  if (!tbody) return;
  try {
    const r = await fetch('JS/datos.json');
    const datos = await r.json();
    tbody.innerHTML = datos.map(d => `
      <tr>
        <td>${d.franja}</td>
        <td><span class="badge-pico">${d.pico}</span></td>
        <td><span class="badge-valle">${d.valle}</span></td>
        <td>${d.destino}</td>
      </tr>`).join('');
  } catch (e) {
    console.error('No se pudo cargar horarios:', e);
  }
}

cargarHorarios();

// estaciones del ramal en orden
const linea = [
  { nombre: 'Retiro', km: 0 },
  { nombre: 'Palermo', km: 4 },
  { nombre: 'Belgrano C', km: 8 },
  { nombre: 'Villa Ballester', km: 20 },
  { nombre: 'Escobar', km: 33 },
  { nombre: 'Campana', km: 55 },
  { nombre: 'Zárate', km: 70 }
];

function buscarRecorrido() {
  const origenVal  = document.querySelector('#origen').value.trim().toLowerCase();
  const destinoVal = document.querySelector('#destino').value.trim().toLowerCase();

  if (!origenVal || !destinoVal) {
    alert('Ingresá una estación de origen y destino.');
    return;
  }

  const estOrigen  = linea.find(e => e.nombre.toLowerCase().includes(origenVal));
  const estDestino = linea.find(e => e.nombre.toLowerCase().includes(destinoVal));

  if (!estOrigen || !estDestino) {
    alert('Estación no encontrada. Probá con: Retiro, Belgrano C, Villa Ballester, Escobar, Campana, Zárate.');
    return;
  }

  if (estOrigen === estDestino) {
    alert('El origen y el destino son la misma estación.');
    return;
  }

  const idxA = linea.indexOf(estOrigen);
  const idxB = linea.indexOf(estDestino);
  const [desde, hasta] = idxA < idxB ? [idxA, idxB] : [idxB, idxA];
  const tramo = linea.slice(desde, hasta + 1);

  const km = Math.abs(estDestino.km - estOrigen.km);
  const minutos = Math.round(km * 1.5);
  const horas = Math.floor(minutos / 60);
  const mins  = minutos % 60;
  const tiempoStr = horas > 0 ? `${horas}h ${mins}m` : `${minutos} min`;

  const trayectoEl = document.querySelector('.trayecto');
  trayectoEl.innerHTML = tramo.map((e, i) => {
    const terminal = i === 0 || i === tramo.length - 1 ? 'terminal' : '';
    const tramo_sep = i < tramo.length - 1 ? '<div class="trayecto-tramo"></div>' : '';
    return `<div class="trayecto-parada ${terminal}">
      <span class="punto"></span><b>${e.nombre}</b>
    </div>${tramo_sep}`;
  }).join('');

  const bs = document.querySelectorAll('.dato-viaje b');
  if (bs[0]) bs[0].textContent = tiempoStr;
  if (bs[1]) bs[1].textContent = '~12 min';

  document.querySelector('.resultado-viaje').scrollIntoView({ behavior: 'smooth' });
}

// datos de estaciones para ubicacion.html
const infoEstaciones = {
  'retiro':          { dir: 'Av. Ramos Mejía 1430, CABA',             horario: '00:00 a 23:59', estado: 'Servicio normal' },
  'belgrano':        { dir: 'Av. Cabildo 2500, CABA',                 horario: '04:00 a 01:00', estado: 'Servicio normal' },
  'villa ballester': { dir: 'Av. Mitre 2000, Villa Ballester',        horario: '04:30 a 00:30', estado: 'Servicio normal' },
  'escobar':         { dir: 'Av. San Martín 500, Escobar',            horario: '05:00 a 23:30', estado: 'Servicio normal' },
  'campana':         { dir: 'Av. Ingeniero Roggero 50, Campana',      horario: '05:30 a 23:00', estado: 'Servicio normal' },
  'zarate':          { dir: 'Justa Lima 200, Zárate',                 horario: '04:00 a 00:30', estado: 'Servicio normal' },
  'zárate':          { dir: 'Justa Lima 200, Zárate',                 horario: '04:00 a 00:30', estado: 'Servicio normal' },
};

function buscarEstacion(valor) {
  const v = valor.trim().toLowerCase();
  if (!v) return;

  const clave = Object.keys(infoEstaciones).find(k => k.includes(v));
  if (!clave) return;

  const est = infoEstaciones[clave];
  const nombre = clave.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

  const dir   = document.querySelector('.dato-mini:nth-child(1) b');
  const hora  = document.querySelector('.dato-mini:nth-child(2) b');
  const estad = document.querySelector('.dato-mini:nth-child(3) b');
  const h1    = document.querySelector('.ubicacion-hero h1');

  if (dir)   dir.textContent   = est.dir;
  if (hora)  hora.textContent  = est.horario;
  if (estad) estad.textContent = est.estado;
  if (h1)    h1.textContent    = 'Estación ' + nombre;
}
