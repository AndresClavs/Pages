// catalogo.js - Página del catálogo (index.html)

let categoriaActiva = 'Todas';
let textoBusqueda = '';

const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function tarjetaHTML(p) {
    return `
        <article class="producto-card" aria-labelledby="prod-${p.id}">
            <div class="img-contenedor">
                ${imagenHTML(p.imagen, 'Fotografía de ' + p.nombre, 'img-producto')}
                <span class="categoria">${esc(p.categoria)}</span>
            </div>
            <div class="producto-info">
                <h3 id="prod-${p.id}">${esc(p.nombre)}</h3>
                <p class="descripcion">${esc(p.descripcion)}</p>
                <p class="en-carrito" data-en-carrito="${p.id}" hidden></p>
                <div class="producto-pie">
                    <p class="precio"><span class="sr-only">Precio: </span>${moneda(p.precio)}</p>
                    <button type="button" class="btn-add" data-id="${p.id}" aria-label="Añadir ${esc(p.nombre)} al carrito">Añadir</button>
                </div>
            </div>
        </article>`;
}

function productosFiltrados() {
    const q = normalizar(textoBusqueda.trim());
    return PRODUCTOS.filter((p) => {
        const coincideCat = categoriaActiva === 'Todas' || p.categoria === categoriaActiva;
        const coincideTexto = !q || normalizar(`${p.nombre} ${p.categoria} ${p.descripcion}`).includes(q);
        return coincideCat && coincideTexto;
    });
}

function marcarEnCarrito() {
    document.querySelectorAll('[data-en-carrito]').forEach((el) => {
        const n = Cart.cantidadDe(Number(el.dataset.enCarrito));
        el.hidden = n === 0;
        el.textContent = `En tu carrito: ${n}`;
    });
}

function renderizarCatalogo() {
    const lista = productosFiltrados();
    $('grid-productos').innerHTML = lista.length
        ? lista.map(tarjetaHTML).join('')
        : '<p class="sin-resultados">No encontramos productos con esos filtros. Prueba con otra búsqueda o categoría.</p>';
    $('resumen').textContent = `Mostrando ${lista.length} de ${PRODUCTOS.length} productos`;
    marcarEnCarrito();
}

function crearFiltros() {
    const categorias = ['Todas', ...new Set(PRODUCTOS.map((p) => p.categoria))];
    $('filtros').innerHTML = categorias.map((c) =>
        `<button type="button" class="chip" data-categoria="${esc(c)}" aria-pressed="${c === categoriaActiva}">${esc(c)}</button>`
    ).join('');
}

// ----- Eventos -----
$('filtros').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    categoriaActiva = chip.dataset.categoria;
    $('filtros').querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    renderizarCatalogo();
});

$('buscador').addEventListener('input', (e) => {
    textoBusqueda = e.target.value;
    renderizarCatalogo();
});

$('grid-productos').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-add');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const producto = PRODUCTOS.find((p) => p.id === id);
    Cart.agregar(id);
    actualizarContador();
    marcarEnCarrito();
    toast(`${producto.nombre} añadido al carrito (${Cart.cantidadDe(id)})`);
});

// ----- Inicio -----
PRODUCTOS_LISTOS.then(() => {
    Cart.inicializar();
    const visitaAnterior = Visita.registrar(); // Cookie
    $('ultima-visita').textContent = visitaAnterior
        ? 'Tu última visita fue el ' + formatearFecha(visitaAnterior) + '.'
        : '¡Bienvenido! Esta es tu primera visita.';
    crearFiltros();
    renderizarCatalogo();
    actualizarContador();
}).catch((error) => {
    console.error('No se pudo iniciar el catálogo.', error);
    $('error-carga').textContent = `No se pudo cargar el catálogo. ${error.message}`;
    $('error-carga').hidden = false;
});
