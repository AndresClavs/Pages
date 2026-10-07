/* ELIVE · elive.js (v2) — datos, estado (localStorage) y componentes compartidos.
   Debe estar en la misma carpeta que las páginas HTML. */

// Foco visible, placeholder legible, menú descartable y movimiento reducido
document.head.insertAdjacentHTML('beforeend', '<style>html{scroll-padding-top:5rem}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible,h1:focus-visible,h2:focus-visible{outline:2px solid #000;outline-offset:2px;box-shadow:0 0 0 4px #fff}input::placeholder{color:rgba(0,0,0,.6);opacity:1}.mega-off>div{display:none!important}@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}</style>');

/* ---------- Datos ---------- */
const ENVIO = 4.99;
const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z';
const TALLAS = ['S', 'M', 'L', 'XL'];
const SOMBRA = 'shadow-[0_1px_2px_rgba(0,0,0,0.06)]';
const CHECK = '<svg class="h-5 w-5 flex-none" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#15803D"/><path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const PRODUCTOS = [
  { id: 1,  nombre: 'Vestido rojo ligero',      precio: 42.90, g: 'mujer',  c: 'Vestidos',   nuevo: true, imagen: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8' },
  { id: 2,  nombre: 'Blusa blanca de lino',     precio: 27.90, g: 'mujer',  c: 'Blusas', imagen: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153' },
  { id: 3,  nombre: 'Jean azul skinny',         precio: 49.00, antes: 59.00, g: 'mujer', c: 'Jeans', imagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246' },
  { id: 4,  nombre: 'Pantalón palo de rosa',    precio: 29.90, g: 'mujer',  c: 'Pantalones', nuevo: true, imagen: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1' },
  { id: 5,  nombre: 'Suéter tejido crema',      precio: 39.90, antes: 49.90, g: 'mujer', c: 'Suéteres', imagen: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105' },
  { id: 6,  nombre: 'Camisa Oxford blanca',     precio: 34.50, g: 'hombre', c: 'Camisas',    nuevo: true, imagen: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10' },
  { id: 7,  nombre: 'Camiseta básica blanca',   precio: 14.90, g: 'hombre', c: 'Camisetas', imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab' },
  { id: 8,  nombre: 'Chaqueta ligera café',     precio: 64.90, antes: 79.90, g: 'hombre', c: 'Chaquetas', imagen: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea' },
  { id: 9,  nombre: 'Pantalón azul recto',      precio: 44.90, g: 'hombre', c: 'Pantalones', nuevo: true, imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80' },
  { id: 10, nombre: 'Camiseta negra estampada', precio: 32.00, g: 'hombre', c: 'Camisetas', imagen: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990' }
];

const DESC = {
  1: 'Vestido rojo ligero para mujer, de tela fresca y corte cómodo. Su diseño versátil es ideal para paseos, reuniones y días cálidos.',
  2: 'Blusa blanca de lino para mujer, fresca y suave al tacto. Su diseño sencillo combina fácilmente con jeans, pantalones o faldas.',
  3: 'Jean azul skinny para mujer, de corte ajustado y denim cómodo. Una prenda versátil para combinar con blusas y camisetas.',
  4: 'Pantalón palo de rosa para mujer, de corte cómodo y color suave. Combina con blusas neutras para crear looks casuales o arreglados.',
  5: 'Suéter de punto color crema para mujer. Tejido suave y cálido para los días frescos.',
  6: 'Camisa Oxford blanca para hombre, con cuello clásico y botones al frente. Una prenda versátil para la oficina o para ocasiones casuales.',
  7: 'Camiseta blanca de cuello redondo para hombre, de algodón y sin estampados. Una prenda básica para todos los días.',
  8: 'Chaqueta ligera café para hombre, de estilo casual y fácil de combinar. Ideal para completar el atuendo en días frescos.',
  9: 'Pantalón azul recto para hombre, de corte clásico y cómodo. Su diseño combina con camisas o camisetas para el día a día.',
  10: 'Camiseta negra estampada para hombre, de cuello redondo y estilo casual. Combina con jeans o pantalones para un look relajado.'
};
PRODUCTOS.forEach(p => p.desc = DESC[p.id]);

/* ---------- Utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);
const prod = id => PRODUCTOS.find(p => p.id === +id);
const emailValido = valor => {
  const email = valor.trim();
  const partes = email.split('@');
  if (partes.length !== 2) return false;
  const [local, dominio] = partes;
  const etiquetas = dominio.split('.');
  return email.length <= 254
    && local.length <= 64
    && /[A-Za-z]/.test(local)
    && /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*$/.test(local)
    && etiquetas.length >= 2
    && etiquetas.every(e => e.length >= 1 && e.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(e))
    && /^[A-Za-z]{2,63}$/.test(etiquetas[etiquetas.length - 1]);
};
// Cada prenda usa su propia imagen de Unsplash en catálogo, ficha y compra.
const foto = (id, n, w = 600, h = 750) => {
  const p = prod(id);
  return p ? `${p.imagen}?auto=format&fit=crop&w=${w}&h=${h}&q=80` : `img/p${id}-${n}.jpg`;
};
document.addEventListener('error', e => {
  const i = e.target;
  if (i.tagName !== 'IMG') return;
  const m = i.src.match(/img\/p(\d+)-(\d+)\.jpg$/);
  if (m && m[2] !== '1') { i.src = `img/p${m[1]}-1.jpg`; return; }
  if (i.dataset.fb) return;
  i.dataset.fb = '1';
  i.src = m ? `https://picsum.photos/seed/elive${m[1]}x1/${i.getAttribute('width') || 600}/${i.getAttribute('height') || 750}` : 'https://picsum.photos/seed/elive-hero/1600/900';
}, true);
const tienda = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return 'index.html' + (q ? '?' + q : '') + '#catalogo';
};

/* ---------- Avisos (toast) con icono de confirmación ----------
   Aviso('Texto');  Aviso('Texto', { accion: 'Deshacer', fn: () => {...} });
   La región role="status" avisa también a los lectores de pantalla (WCAG 4.1.3). */
const Aviso = (() => {
  const reg = document.createElement('div');
  reg.id = 'avisos';
  reg.setAttribute('role', 'status');
  reg.setAttribute('aria-live', 'polite');
  reg.className = 'pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4';
  document.body.appendChild(reg);
  return (msg, op = {}) => {
    while (reg.children.length >= 3) reg.firstChild.remove();
    const t = document.createElement('div');
    t.className = 'pointer-events-auto flex w-full max-w-md items-center gap-3 bg-black px-4 py-3 text-sm text-white shadow-lg';
    t.innerHTML = `${CHECK}<p class="flex-1">${msg}</p>`
      + (op.accion ? `<button type="button" data-a class="font-semibold underline underline-offset-4">${op.accion}</button>` : '')
      + '<button type="button" data-x aria-label="Cerrar aviso" class="p-1"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
    let id;
    const quitar = () => { clearTimeout(id); t.remove(); };
    const armar = () => { clearTimeout(id); id = setTimeout(quitar, op.accion ? 8000 : 5000); };
    t.addEventListener('mouseenter', () => clearTimeout(id));
    t.addEventListener('focusin', () => clearTimeout(id));
    t.addEventListener('mouseleave', armar);
    t.addEventListener('focusout', armar);
    $('[data-x]', t).addEventListener('click', quitar);
    const a = $('[data-a]', t);
    if (a) a.addEventListener('click', () => { op.fn(); quitar(); });
    reg.appendChild(t);
    armar();
  };
})();

/* ---------- Estado en localStorage ---------- */
const Store = {
  get(k, d) {
    try { const v = localStorage.getItem('elive_' + k); return v === null ? d : JSON.parse(v); }
    catch (e) { return d; }
  },
  set(k, v) {
    try { localStorage.setItem('elive_' + k, JSON.stringify(v)); } catch (e) {}
    document.dispatchEvent(new Event('elive:change'));
  }
};

const Fav = {
  list: () => Store.get('fav', []),
  has: id => Fav.list().includes(+id),
  toggle(id) {
    id = +id;
    const l = Fav.list(), i = l.indexOf(id), n = prod(id).nombre;
    i > -1 ? l.splice(i, 1) : l.push(id);
    Store.set('fav', l);
    i > -1
      ? Aviso(`${n} se quitó de favoritos`, { accion: 'Deshacer', fn: () => Fav.toggle(id) })
      : Aviso(`${n} se guardó en favoritos`);
  }
};

const Cart = {
  list: () => Store.get('cart', []),
  add(id, talla) {
    const l = Cart.list();
    const it = l.find(i => i.id === +id && i.talla === talla);
    it ? it.cant = Math.min(10, it.cant + 1) : l.push({ id: +id, talla, cant: 1 });
    Store.set('cart', l);
  },
  setCant(i, n) {
    const l = Cart.list();
    if (l[i]) { l[i].cant = n; Store.set('cart', l); Aviso(`Cantidad actualizada: ${n}`); }
  },
  remove(i) {
    const l = Cart.list();
    const [it] = l.splice(i, 1);
    if (!it) return;
    Store.set('cart', l);
    Aviso(`${prod(it.id).nombre} se eliminó de la bolsa`, {
      accion: 'Deshacer',
      fn: () => { const l2 = Cart.list(); l2.splice(Math.min(i, l2.length), 0, it); Store.set('cart', l2); }
    });
  },
  clear() { Store.set('cart', []); },
  count: () => Cart.list().reduce((a, i) => a + i.cant, 0),
  subtotal: () => Cart.list().reduce((a, i) => a + prod(i.id).precio * i.cant, 0),
  envio: () => (Cart.count() === 0 ? 0 : Store.get('registrado', false) ? 0 : ENVIO),
  total: () => Cart.subtotal() + Cart.envio()
};

/* ---------- Componentes ---------- */
const heartSvg = (cls, lleno) =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="${lleno ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" aria-hidden="true"><path d="${HEART}"/></svg>`;

function precioHtml(p) {
  return (p.antes ? `<span class="mr-2 font-normal text-black/60 line-through"><span class="sr-only">Antes: </span>${money(p.antes)}</span>` : '') + money(p.precio);
}

function card(p) {
  const url = `producto.html?id=${p.id}`;
  return `
  <li class="bg-white ${SOMBRA}">
    <article class="group">
      <div class="relative overflow-hidden">
        <a href="${url}" tabindex="-1" aria-hidden="true"><img src="${foto(p.id, 1, 600, 750)}" alt="" loading="lazy" width="600" height="750" class="aspect-[4/5] w-full object-cover"></a>
        <button type="button" data-fav="${p.id}" aria-pressed="${Fav.has(p.id)}" aria-label="Guardar ${p.nombre} en favoritos"
                class="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-black transition-colors hover:bg-white">${heartSvg('h-[18px] w-[18px]', Fav.has(p.id))}</button>
        <a href="${url}" class="absolute inset-x-0 bottom-0 bg-black py-3 text-center text-sm tracking-wide text-white transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">Elegir talla y añadir</a>
      </div>
      <div class="p-4">
        <h3 class="text-sm"><a href="${url}" class="underline-offset-4 hover:underline">${p.nombre}</a></h3>
        <p class="mt-1 text-sm font-semibold">${precioHtml(p)}</p>
      </div>
    </article>
  </li>`;
}

function syncHearts() {
  $$('[data-fav]').forEach(b => {
    const on = Fav.has(b.dataset.fav);
    b.setAttribute('aria-pressed', on);
    const s = b.querySelector('svg');
    if (s) s.setAttribute('fill', on ? 'currentColor' : 'none');
  });
}

function pintarBadges() {
  const n = Cart.count(), f = Fav.list().length;
  const cb = $('#cart-badge'), fb = $('#fav-badge'), cl = $('#cart-link'), fl = $('#fav-link');
  if (cb) { cb.textContent = n; cb.classList.toggle('hidden', n === 0); }
  if (fb) { fb.textContent = f; fb.classList.toggle('hidden', f === 0); }
  if (cl) cl.setAttribute('aria-label', `Bolsa, ${n} ${n === 1 ? 'artículo' : 'artículos'}`);
  if (fl) fl.setAttribute('aria-label', `Favoritos, ${f} ${f === 1 ? 'prenda' : 'prendas'}`);
}

function pintarCuenta() {
  const p = $('#panel-cuenta');
  if (!p) return;
  p.innerHTML = Store.get('registrado', false)
    ? `<p class="flex items-center gap-2 text-sm font-medium text-green-700">${CHECK}<span>Hola, ${escapa((Store.get('usuario', null) || {}).nombre || 'bienvenido/a')}. Tu envío es gratis.</span></p><button type="button" data-cuenta="salir" class="mt-3 w-full border border-black px-4 py-2 text-sm transition-colors hover:bg-black hover:text-white">Cerrar sesión</button>`
    : `<p class="text-sm">Regístrate gratis y obtén envío sin costo.</p><button type="button" data-registro class="mt-3 w-full bg-black px-4 py-2 text-sm text-white transition-colors hover:bg-black/85">Crear cuenta gratis</button>`;
  if (Store.get('pedido', null)) p.insertAdjacentHTML('beforeend', '<a href="pedido.html" class="mt-3 block text-center text-sm underline underline-offset-4">Ver estado de mi pedido</a>');
}

/* ---------- Menú principal ---------- */
const MENUS = [
  { t: 'Mujer', href: tienda({ g: 'mujer' }), cols: [
    { h: 'Ropa', items: [['Ver todo', tienda({ g: 'mujer' })], ...['Vestidos', 'Blusas', 'Jeans', 'Faldas', 'Suéteres'].map(c => [c, tienda({ g: 'mujer', c })])] },
    { h: 'Destacado', items: [['Nuevos en mujer', tienda({ g: 'nuevos', s: 'mujer' })], ['Ofertas en mujer', tienda({ g: 'ofertas', s: 'mujer' })]] }
  ] },
  { t: 'Hombre', href: tienda({ g: 'hombre' }), cols: [
    { h: 'Ropa', items: [['Ver todo', tienda({ g: 'hombre' })], ...['Camisetas', 'Camisas', 'Pantalones', 'Chaquetas'].map(c => [c, tienda({ g: 'hombre', c })])] },
    { h: 'Destacado', items: [['Nuevos en hombre', tienda({ g: 'nuevos', s: 'hombre' })], ['Ofertas en hombre', tienda({ g: 'ofertas', s: 'hombre' })]] }
  ] },
  { t: 'Nuevos', href: tienda({ g: 'nuevos' }), cols: [
    { h: 'Recién llegados', items: [['Ver todo lo nuevo', tienda({ g: 'nuevos' })], ['Nuevos en mujer', tienda({ g: 'nuevos', s: 'mujer' })], ['Nuevos en hombre', tienda({ g: 'nuevos', s: 'hombre' })]] }
  ] },
  { t: 'Ofertas', href: tienda({ g: 'ofertas' }), cols: [
    { h: 'Ahorra en familia', items: [['Ver todas las ofertas', tienda({ g: 'ofertas' })], ['Ofertas en mujer', tienda({ g: 'ofertas', s: 'mujer' })], ['Ofertas en hombre', tienda({ g: 'ofertas', s: 'hombre' })]] }
  ] }
];

// modo 'simple': solo logo + bolsa. Cualquier otro valor: barra completa.
function mountHeader(modo) {
  const completo = modo !== 'simple';
  const h = $('#site-header');
  h.className = 'sticky top-0 z-40 border-b border-black/10 bg-[#F9F9F6]';

  const ico = 'class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"';
  const badge = 'absolute right-1 top-0 hidden min-w-[1.25rem] rounded-full bg-black px-1 text-center text-xs font-bold leading-5 text-white';
  const btnIco = 'flex flex-col items-center p-2';
  // Texto visible bajo cada icono en escritorio (reconocer en vez de recordar)
  const eti = t => `<span class="hidden text-xs lg:block" aria-hidden="true">${t}</span>`;
  // El enlace ocupa toda la altura de la barra en escritorio: así no hay hueco entre el enlace y el megamenú
  const enlace = 'block py-3 text-sm tracking-wide underline-offset-[10px] decoration-1 hover:underline lg:flex lg:h-full lg:items-center lg:py-0';

  const menus = MENUS.map(m => `
    <li class="group lg:flex">
      <a href="${m.href}" class="${enlace}">${m.t}</a>
      <div class="absolute left-0 right-0 top-full hidden border-y border-black/10 bg-white shadow-sm lg:group-hover:block lg:group-focus-within:block">
        <div class="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-8 py-8">
          ${m.cols.map(c => `<div><h3 class="mb-3 font-semibold">${c.h}</h3><ul class="space-y-2">${c.items.map(([t, href]) => `<li><a href="${href}" class="underline-offset-4 hover:underline">${t}</a></li>`).join('')}</ul></div>`).join('')}
        </div>
      </div>
    </li>`).join('');

  h.innerHTML = `
  <div class="mx-auto flex max-w-7xl items-stretch justify-between gap-2 px-4 lg:px-8">
    ${completo ? `<button id="menu-btn" type="button" class="my-2 self-center p-2 lg:hidden" aria-expanded="false" aria-controls="menu-principal" aria-label="Abrir menú"><svg ${ico}><path d="M4 8h16M4 16h16"/></svg></button>` : ''}
    <a href="index.html" class="flex items-center py-4 text-xl font-medium uppercase tracking-[0.35em] sm:text-2xl [font-family:Jost,'Helvetica_Neue',Arial,sans-serif]" aria-label="Elive, ir al inicio">ELIVE</a>
    ${completo ? `
    <nav id="menu-principal" aria-label="Principal" class="absolute left-0 right-0 top-full hidden border-b border-black/10 bg-[#F9F9F6] lg:static lg:flex lg:border-0 lg:bg-transparent">
      <ul class="flex flex-col px-4 py-2 lg:flex-row lg:gap-8 lg:p-0">
        <li class="lg:flex"><a href="index.html" class="${enlace}">Inicio</a></li>${menus}
      </ul>
    </nav>` : ''}
    <ul class="flex items-center">
      ${completo ? `<li><button id="btn-buscar" type="button" class="${btnIco}" aria-expanded="false" aria-controls="panel-buscar" aria-label="Buscar"><svg ${ico}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>${eti('Buscar')}</button></li>
      <li><a href="favoritos.html" id="fav-link" class="relative ${btnIco}" aria-label="Favoritos"><svg ${ico}><path d="${HEART}"/></svg>${eti('Favoritos')}<span id="fav-badge" class="${badge}" aria-hidden="true">0</span></a></li>` : ''}
      <li><a href="carrito.html" id="cart-link" class="relative ${btnIco}" aria-label="Bolsa"><svg ${ico}><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>${eti('Bolsa')}<span id="cart-badge" class="${badge}" aria-hidden="true">0</span></a></li>
      ${completo ? `<li class="relative"><button id="btn-cuenta" type="button" class="${btnIco}" aria-expanded="false" aria-controls="panel-cuenta" aria-label="Mi cuenta"><svg ${ico}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>${eti('Mi cuenta')}</button>
        <div id="panel-cuenta" class="absolute right-0 top-full z-50 mt-2 hidden w-64 border border-black/10 bg-white p-4 shadow-sm"></div></li>` : ''}
    </ul>
  </div>
  ${completo ? `<div id="panel-buscar" class="hidden border-t border-black/10 bg-[#F9F9F6]">
    <form role="search" action="index.html" method="get" class="mx-auto flex max-w-7xl gap-2 px-4 py-3 lg:px-8">
      <label for="q" class="sr-only">Buscar prendas</label>
      <input id="q" name="q" type="search" placeholder="Buscar prendas" class="w-full border border-black bg-white px-4 py-2">
      <button type="submit" class="bg-black px-6 py-2 text-sm text-white transition-colors hover:bg-black/85">Buscar</button>
    </form>
  </div>` : ''}`;

  if (completo) {
    const btn = $('#menu-btn'), nav = $('#menu-principal');
    btn.addEventListener('click', () => {
      const abierto = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!abierto));
      nav.classList.toggle('hidden', abierto);
    });
    const paneles = [['#btn-buscar', '#panel-buscar'], ['#btn-cuenta', '#panel-cuenta']];
    paneles.forEach(([b, p]) => $(b).addEventListener('click', () => {
      const abrir = $(p).classList.contains('hidden');
      paneles.forEach(([b2, p2]) => { $(p2).classList.add('hidden'); $(b2).setAttribute('aria-expanded', 'false'); });
      if (abrir) {
        $(p).classList.remove('hidden');
        $(b).setAttribute('aria-expanded', 'true');
        if (p === '#panel-buscar') $('#q').focus();
      }
    }));
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      // Cierra el megamenú abierto (WCAG 1.4.13: contenido descartable)
      const g = (document.activeElement && document.activeElement.closest('#site-header li.group')) || $('#site-header li.group:hover');
      if (g) {
        g.classList.add('mega-off');
        $('a', g).focus();
        const reabrir = () => g.classList.remove('mega-off');
        g.addEventListener('mouseleave', reabrir, { once: true });
        g.addEventListener('focusout', reabrir, { once: true });
      }
      paneles.forEach(([b, p]) => {
        if (!$(p).classList.contains('hidden')) { $(p).classList.add('hidden'); $(b).setAttribute('aria-expanded', 'false'); $(b).focus(); }
      });
    });
    $('#q').value = new URLSearchParams(location.search).get('q') || '';
    // Página actual en el menú
    if (/(index\.html|\/)$/.test(location.pathname) && !location.search) $('#menu-principal a[href="index.html"]').setAttribute('aria-current', 'page');
  }
  pintarBadges();
  pintarCuenta();
}

/* ---------- Pie de página con ayuda (mismo lugar en todas las páginas) ---------- */
(() => {
  const f = $('footer');
  if (!f) return;
  const d = (t, c) => `<details class="border-b border-black/10 py-3"><summary class="cursor-pointer text-sm font-medium">${t}</summary><p class="mt-2 text-sm">${c}</p></details>`;
  f.className = 'mt-12 border-t border-black/10 px-4 py-8';
  f.innerHTML = `<div class="mx-auto max-w-3xl">
    <h2 class="mb-2 text-base font-semibold">¿Necesitas ayuda?</h2>
    ${d('Envíos y entregas', `El envío cuesta ${money(ENVIO)} y es gratis si te registras. Entregamos en 3 a 5 días hábiles.`)}
    ${d('Cambios y devoluciones', 'Puedes devolver tu pedido hasta 30 días después de recibirlo, con las etiquetas puestas.')}
    ${d('Contacto', 'Escríbenos a <a href="mailto:soporteelive@gmail.com" class="underline underline-offset-4">soporteelive@gmail.com</a>. Respondemos de lunes a viernes, de 9:00 a 18:00.')}
    <p class="mt-6 text-center text-xs">Imágenes de productos proporcionadas por Unsplash.</p>
    <p class="mt-2 text-center text-sm">&copy; 2026 ELIVE. Ropa para toda la familia.</p>
  </div>`;
})();

/* ---------- Registro de usuario (ventana) ----------
   Registrarse activa el envío gratis (Cart.envio lee 'registrado'). Se abre con Registro.abrir()
   o con cualquier elemento que tenga el atributo data-registro. */
const escapa = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const Registro = (() => {
  const ALERTA = '<svg class="h-5 w-5 flex-none" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4M12 17v.5"/></svg>';
  const OKI = id => `<svg id="r-ok-${id}" class="pointer-events-none absolute right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2" fill="none" stroke="#15803D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>`;
  const BASE = 'w-full bg-white px-4 py-3 pr-11 ';
  const REGLAS = {
    nombre: v => !v.trim() ? 'Escribe tu nombre'
      : !/^[\p{L}][\p{L}\s'’-]*$/u.test(v.trim()) ? 'Usa solo letras en tu nombre, sin números ni símbolos'
      : v.trim().length < 2 ? 'Escribe al menos 2 letras' : '',
    email: v => !v.trim() ? 'Escribe tu correo electrónico' : emailValido(v) ? '' : 'Escribe un correo válido con un nombre y dominio correctos, por ejemplo nombre@correo.com',
    clave: v => !v ? 'Crea una contraseña' : v.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : v.length > 128 ? 'La contraseña no puede superar 128 caracteres' : ''
  };
  const CAMPOS = [['nombre', 'Nombre', 'text', 'name', ''], ['email', 'Correo electrónico', 'email', 'email', 'Ejemplo: nombre@correo.com'], ['clave', 'Contraseña', 'password', 'new-password', 'Entre 6 y 128 caracteres']];
  let m = null, previo = null;
  const el = id => document.getElementById('r-' + id);

  function validar(id) {
    const i = el(id), msg = REGLAS[id](i.value), e = el('er-' + id);
    e.textContent = ''; e.classList.add('hidden'); e.classList.remove('flex');
    el('ok-' + id).classList.toggle('hidden', !!msg);
    i.className = BASE + (msg ? 'border-2 border-red-600' : 'border-2 border-green-700');
    if (msg) { e.innerHTML = ALERTA + '<span>' + msg + '</span>'; e.classList.remove('hidden'); e.classList.add('flex'); i.setAttribute('aria-invalid', 'true'); }
    else i.removeAttribute('aria-invalid');
    return !msg;
  }
  function teclas(e) {
    if (e.key === 'Escape') { cerrar(); return; }
    if (e.key === 'Tab') {
      const f = [...m.querySelectorAll('button, input')], a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  }
  function cerrar() {
    if (!m) return;
    m.remove(); m = null;
    document.body.classList.remove('overflow-hidden');
    document.removeEventListener('keydown', teclas);
    const f = previo && document.contains(previo) ? previo : document.getElementById('btn-cuenta');
    if (f) f.focus();
  }
  function abrir(opciones = {}) {
    if (m) return;
    previo = document.activeElement;
    if (previo && previo.closest && previo.closest('#panel-cuenta')) { previo = document.getElementById('btn-cuenta'); previo.click(); }
    m = document.createElement('div');
    m.className = 'fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4';
    m.innerHTML = `
    <div role="dialog" aria-modal="true" aria-labelledby="reg-titulo" class="relative max-h-full w-full max-w-md overflow-y-auto bg-white p-6 sm:p-8">
      <button type="button" aria-label="Cerrar ventana" data-x class="absolute right-3 top-3 p-2"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
      <h2 id="reg-titulo" class="pr-8 text-xl font-semibold">Crea tu cuenta gratis</h2>
      <p class="mt-3 flex items-center gap-2 text-sm font-medium text-green-700">${CHECK}<span>Envío gratis en todos tus pedidos. Ahorras ${money(ENVIO)} cada vez.</span></p>
      <p class="mt-2 text-sm">Sin cuenta, el envío cuesta ${money(ENVIO)}. Todos los campos son obligatorios.</p>
      <form novalidate class="mt-5 space-y-4">
        ${CAMPOS.map(([id, et, tipo, ac, ay]) => `
        <div>
          <label for="r-${id}" class="mb-1 block text-sm font-medium">${et}</label>
          <div class="relative"><input id="r-${id}" type="${tipo}" autocomplete="${ac}" maxlength="${id === 'email' ? 254 : id === 'clave' ? 128 : 60}" required aria-describedby="r-ay-${id} r-er-${id}" class="${BASE}border border-black">${OKI(id)}</div>
          <p id="r-ay-${id}" class="mt-1 text-xs ${ay ? '' : 'hidden'}">${ay}</p>
          <p id="r-er-${id}" class="mt-1 hidden items-center gap-2 text-sm font-medium text-red-600"></p>
        </div>`).join('')}
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" id="r-ver" class="h-4 w-4"> Mostrar contraseña</label>
        <button type="submit" class="w-full bg-black py-3 font-medium tracking-wide text-white transition-colors hover:bg-black/85">Crear cuenta</button>
      </form>
      <p class="mt-4 text-center text-xs">Registro de ejemplo: tus datos se guardan solo en este navegador.</p>
    </div>`;
    document.body.appendChild(m);
    document.body.classList.add('overflow-hidden');
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-x]')) cerrar(); });
    el('ver').addEventListener('change', e => { el('clave').type = e.target.checked ? 'text' : 'password'; });
    CAMPOS.forEach(([id]) => {
      const i = el(id);
      i.addEventListener('blur', () => { if (i.value) validar(id); });
      i.addEventListener('input', () => {
        if (id === 'nombre') i.value = i.value.replace(/[^\p{L}\s'’-]/gu, '');
        if (i.getAttribute('aria-invalid') === 'true' && !REGLAS[id](i.value)) validar(id);
        else if (i.getAttribute('aria-invalid') !== 'true') { el('ok-' + id).classList.add('hidden'); i.className = BASE + 'border border-black'; }
      });
    });
    $('form', m).addEventListener('submit', e => {
      e.preventDefault();
      const malos = CAMPOS.map(c => c[0]).filter(id => !validar(id));
      if (malos.length) { el(malos[0]).focus(); return; }
      const nombre = el('nombre').value.trim();
      Store.set('usuario', { nombre, email: el('email').value.trim() });
      Store.set('registrado', true);
      cerrar();
      if (opciones.redirectTo) {
        location.assign(opciones.redirectTo);
        return;
      }
      Aviso(`¡Bienvenido/a, ${escapa(nombre.split(' ')[0])}! Tu envío ahora es gratis.`);
    });
    document.addEventListener('keydown', teclas);
    el('nombre').focus();
  }
  return { abrir };
})();

/* ---------- Eventos globales ---------- */
document.addEventListener('elive:change', () => { syncHearts(); pintarBadges(); pintarCuenta(); });
window.addEventListener('storage', () => document.dispatchEvent(new Event('elive:change')));
document.addEventListener('click', e => {
  const f = e.target.closest('[data-fav]');
  if (f) Fav.toggle(f.dataset.fav);
  if (e.target.closest('[data-registro]')) Registro.abrir();
  if (e.target.closest('[data-cuenta="salir"]')) { Store.set('registrado', false); Aviso('Cerraste sesión.'); }
});