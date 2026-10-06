// checkout.js - Página del carrito y finalización de compra (carrito.html)

// ===== Validaciones con expresiones regulares =====
const LETRAS = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
const REGLAS = {
    nombre: {
        regex: new RegExp('^[' + LETRAS + ']{2,}(\\s+[' + LETRAS + ']{2,})+$'),
        mensaje: 'Ingresa nombre y apellido (solo letras y espacios).'
    },
    email: {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
        mensaje: 'Ingresa un correo válido, por ejemplo usuario@dominio.com.'
    },
    telefono: {
        regex: /^\+?\d{7,15}$/,
        mensaje: 'Ingresa un teléfono de 7 a 15 dígitos (puede iniciar con +).'
    }
};
const CAMPOS = Object.keys(REGLAS);

function validarCampo(campo) {
    const input = $(campo);
    const error = $('err-' + campo);
    let valor = input.value.trim();
    if (campo === 'telefono') valor = valor.replace(/[\s()-]/g, '');

    const valido = REGLAS[campo].regex.test(valor);
    input.setAttribute('aria-invalid', String(!valido));
    input.classList.toggle('ok', valido);
    error.textContent = valido ? '' : (valor === '' ? 'Este campo es obligatorio.' : REGLAS[campo].mensaje);
    error.hidden = valido;
    return valido;
}

function reiniciarFormulario() {
    $('form-checkout').reset();
    CAMPOS.forEach((c) => {
        $(c).removeAttribute('aria-invalid');
        $(c).classList.remove('ok');
        $('err-' + c).hidden = true;
    });
    Borrador.limpiar(CAMPOS); // sessionStorage
}

// ===== Renderizado =====
function itemHTML(i) {
    return `
        <li class="cart-item">
            ${imagenHTML(i.imagen, '', 'cart-thumb', 72)}
            <div class="cart-item-info">
                <span class="cart-item-nombre">${esc(i.nombre)}</span>
                <small>${moneda(i.precio)} c/u · ${esc(i.categoria)}</small>
            </div>
            <button type="button" class="btn-del" data-accion="eliminar" data-id="${i.id}" aria-label="Eliminar ${esc(i.nombre)} del carrito">✕</button>
            <div class="cantidad" role="group" aria-label="Cantidad de ${esc(i.nombre)}">
                <button type="button" class="btn-qty" data-accion="restar" data-id="${i.id}" aria-label="Disminuir cantidad de ${esc(i.nombre)}"${i.cantidad <= 1 ? ' aria-disabled="true"' : ''}>−</button>
                <span class="cantidad-valor">${i.cantidad}</span>
                <button type="button" class="btn-qty" data-accion="sumar" data-id="${i.id}" aria-label="Aumentar cantidad de ${esc(i.nombre)}">+</button>
            </div>
            <strong class="cart-item-subtotal">${moneda(i.subtotal)}</strong>
        </li>`;
}

function mostrarUltimoPedido() {
    const p = Pedido.ultimo(); // localStorage
    const el = $('ultimo-pedido');
    el.hidden = !p;
    if (p) el.textContent = `Tu último pedido fue el ${p.numero} por ${moneda(p.total)} (${formatearFecha(p.fecha)}).`;
}

function renderizar() {
    const detalle = Cart.detalle();
    const vacio = detalle.length === 0;
    $('vista-vacia').hidden = !vacio;
    $('vista-carrito').hidden = vacio;

    if (vacio) {
        mostrarUltimoPedido();
    } else {
        $('lista-carrito').innerHTML = detalle.map(itemHTML).join('');
        const t = Cart.totales();
        $('unidades').textContent = Cart.unidades();
        $('subtotal').textContent = moneda(t.subtotal);
        $('iva').textContent = moneda(t.iva);
        $('total').textContent = moneda(t.total);
        const fecha = Cart.ultimaActualizacion();
        $('ultima-actualizacion').textContent = fecha ? formatearFecha(fecha) : '—';
        if (fecha) $('ultima-actualizacion').dateTime = fecha;
    }
    actualizarContador();
}

// ===== Ventanas emergentes (<dialog>) =====
function filaResumen(dl, titulo, valor) {
    const dt = document.createElement('dt');
    dt.textContent = titulo;
    const dd = document.createElement('dd');
    dd.textContent = valor;
    dl.append(dt, dd);
}

function abrirDialogo(dialogo) {
    if (typeof dialogo.showModal === 'function') {
        dialogo.returnValue = '';
        dialogo.showModal();
        return true;
    }
    return false;
}

function mostrarDialogoExito(pedido) {
    const dl = $('resumen-pedido');
    dl.replaceChildren();
    filaResumen(dl, 'Pedido', pedido.numero);
    filaResumen(dl, 'Cliente', pedido.nombre);
    filaResumen(dl, 'Correo', pedido.email);
    filaResumen(dl, 'Productos', `${pedido.unidades} ${pedido.unidades === 1 ? 'unidad' : 'unidades'}`);
    filaResumen(dl, 'Total pagado', moneda(pedido.total));
    filaResumen(dl, 'Fecha', formatearFecha(pedido.fecha));
    $('d-exito').textContent = `Gracias, ${pedido.nombre.split(/\s+/)[0]}. Te enviaremos la confirmación a tu correo.`;

    if (!abrirDialogo($('dialogo-exito'))) {
        alert(`¡Compra realizada! Pedido ${pedido.numero} por ${moneda(pedido.total)}.`);
        $('titulo-pagina').focus();
    }
}

// Al cerrar el popup de éxito, el foco vuelve al título de la página
$('dialogo-exito').addEventListener('close', () => $('titulo-pagina').focus());

$('dialogo-vaciar').addEventListener('close', () => {
    if ($('dialogo-vaciar').returnValue === 'confirmar') {
        Cart.vaciar();
        renderizar();
        toast('Carrito vaciado');
    }
    $('titulo-pagina').focus();
});

// ===== Eventos =====
$('lista-carrito').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-accion]');
    if (!btn || btn.getAttribute('aria-disabled') === 'true') return;

    const id = Number(btn.dataset.id);
    const accion = btn.dataset.accion;
    const producto = PRODUCTOS.find((p) => p.id === id);

    if (accion === 'eliminar') {
        Cart.quitar(id);
        toast(`${producto.nombre} eliminado del carrito`);
    } else {
        const cantidad = Cart.cambiar(id, accion === 'sumar' ? 1 : -1);
        anunciar(`${producto.nombre}: cantidad ${cantidad}`);
    }
    renderizar();

    // Mantener el foco tras volver a dibujar la lista
    const lista = $('lista-carrito');
    const objetivo = lista.querySelector(`[data-accion="${accion}"][data-id="${id}"]`)
        || lista.querySelector('button[data-accion]')
        || $('titulo-pagina');
    objetivo.focus();
});

$('btn-vaciar').addEventListener('click', () => {
    if (!abrirDialogo($('dialogo-vaciar'))) {
        if (confirm('¿Vaciar el carrito?')) { Cart.vaciar(); renderizar(); }
    }
});

CAMPOS.forEach((campo) => {
    const input = $(campo);
    let tocado = false;
    input.value = Borrador.leer(campo); // sessionStorage: restaurar borrador
    input.addEventListener('blur', () => { if (input.value !== '') { tocado = true; validarCampo(campo); } });
    input.addEventListener('input', () => { Borrador.guardar(campo, input.value); if (tocado) validarCampo(campo); });
});

$('form-checkout').addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = $('mensaje');
    const invalidos = CAMPOS.filter((c) => !validarCampo(c));

    if (invalidos.length > 0) {
        mensaje.className = 'mensaje error';
        mensaje.textContent = 'Revisa los campos marcados antes de continuar.';
        $(invalidos[0]).focus();
        return;
    }

    const pedido = {
        numero: 'TS-' + Date.now().toString(36).toUpperCase(),
        nombre: $('nombre').value.trim(),
        email: $('email').value.trim(),
        unidades: Cart.unidades(),
        total: Cart.totales().total,
        fecha: new Date().toISOString()
    };

    Pedido.guardar(pedido);   // localStorage
    Cart.vaciar();
    reiniciarFormulario();
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
    renderizar();
    mostrarDialogoExito(pedido);
});

// ===== Inicio =====
renderizar();
