// cart.js - Modelo del carrito y mecanismos de persistencia
//  - localStorage : carrito, fecha de última actualización y último pedido
//  - sessionStorage: borradores del formulario
//  - cookies       : última visita

const Cart = (() => {
    const CLAVE = 'techstore_carrito';
    const CLAVE_FECHA = 'techstore_fecha';
    const IVA = 0.15;
    const MAX = 99;

    const buscar = (id) => PRODUCTOS.find((p) => p.id === id);

    function leer() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE));
            if (!Array.isArray(datos)) return [];
            return datos
                .filter((i) => buscar(i.id) && Number.isInteger(i.cantidad) && i.cantidad > 0)
                .map((i) => ({ id: i.id, cantidad: Math.min(i.cantidad, MAX) }));
        } catch (e) {
            return [];
        }
    }

    let items = leer();

    function guardar() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(items));
            localStorage.setItem(CLAVE_FECHA, new Date().toISOString());
        } catch (e) {
            console.warn('No se pudo guardar el carrito', e);
        }
    }

    return {
        IVA,
        cantidadDe(id) {
            const item = items.find((i) => i.id === id);
            return item ? item.cantidad : 0;
        },
        unidades() {
            return items.reduce((acc, i) => acc + i.cantidad, 0);
        },
        agregar(id) {
            const item = items.find((i) => i.id === id);
            if (item) item.cantidad = Math.min(item.cantidad + 1, MAX);
            else items.push({ id, cantidad: 1 });
            guardar();
        },
        cambiar(id, delta) {
            const item = items.find((i) => i.id === id);
            if (!item) return 0;
            item.cantidad = Math.max(1, Math.min(item.cantidad + delta, MAX));
            guardar();
            return item.cantidad;
        },
        quitar(id) {
            items = items.filter((i) => i.id !== id);
            guardar();
        },
        vaciar() {
            items = [];
            guardar();
        },
        // Productos del carrito con sus datos completos
        detalle() {
            return items.map((i) => {
                const p = buscar(i.id);
                return { ...p, cantidad: i.cantidad, subtotal: p.precio * i.cantidad };
            });
        },
        // Cálculo en centavos para evitar errores de decimales
        totales() {
            const sub = items.reduce((acc, i) => acc + Math.round(buscar(i.id).precio * 100) * i.cantidad, 0);
            const iva = Math.round(sub * IVA);
            return { subtotal: sub / 100, iva: iva / 100, total: (sub + iva) / 100 };
        },
        ultimaActualizacion() {
            try { return localStorage.getItem(CLAVE_FECHA); } catch (e) { return null; }
        }
    };
})();

// ----- Cookies: última visita -----
const Visita = {
    registrar() {
        const par = document.cookie.split('; ').find((c) => c.startsWith('ultima_visita='));
        const anterior = par ? decodeURIComponent(par.split('=')[1]) : null;
        document.cookie = 'ultima_visita=' + encodeURIComponent(new Date().toISOString()) + '; max-age=2592000; path=/';
        return anterior;
    }
};

// ----- sessionStorage: borradores del formulario -----
const Borrador = {
    PREFIJO: 'techstore_borrador_',
    guardar(campo, valor) {
        try { sessionStorage.setItem(this.PREFIJO + campo, valor); } catch (e) { /* no disponible */ }
    },
    leer(campo) {
        try { return sessionStorage.getItem(this.PREFIJO + campo) || ''; } catch (e) { return ''; }
    },
    limpiar(campos) {
        try { campos.forEach((c) => sessionStorage.removeItem(this.PREFIJO + c)); } catch (e) { /* ignorar */ }
    }
};

// ----- localStorage: último pedido -----
const Pedido = {
    CLAVE: 'techstore_ultimo_pedido',
    guardar(pedido) {
        try { localStorage.setItem(this.CLAVE, JSON.stringify(pedido)); } catch (e) { console.warn(e); }
    },
    ultimo() {
        try { return JSON.parse(localStorage.getItem(this.CLAVE)); } catch (e) { return null; }
    }
};
