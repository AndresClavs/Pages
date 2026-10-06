// ui.js - Utilidades compartidas por las dos páginas

const $ = (id) => document.getElementById(id);
const moneda = (n) => '$' + n.toFixed(2);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function formatearFecha(iso) {
    const d = new Date(iso);
    return isNaN(d) ? '—' : d.toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' });
}

// <img> con imagen de respaldo si la URL falla
function imagenHTML(src, alt, clase, tam) {
    const medidas = tam ? ` width="${tam}" height="${tam}"` : '';
    return `<img class="${clase}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy"${medidas} onerror="this.onerror=null;this.src='assets/img/placeholder.svg'">`;
}

// Mensaje flotante visual (también lo leen los lectores de pantalla: role="status")
let temporizadorToast;
function toast(texto) {
    const t = $('toast');
    if (!t) return;
    t.textContent = texto;
    t.classList.add('visible');
    clearTimeout(temporizadorToast);
    temporizadorToast = setTimeout(() => t.classList.remove('visible'), 3500);
}

// Anuncio solo para lectores de pantalla
function anunciar(texto) {
    const r = $('anuncios');
    if (!r) return;
    r.textContent = '';
    setTimeout(() => { r.textContent = texto; }, 50);
}

function actualizarContador() {
    const n = Cart.unidades();
    $('cart-count').textContent = n;
    $('enlace-carrito').setAttribute('aria-label', `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);
}

// Si el usuario vuelve con el botón "atrás", refresca el contador
window.addEventListener('pageshow', actualizarContador);
