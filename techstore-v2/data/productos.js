// Carga y valida el catálogo JSON antes de iniciar la tienda.
let PRODUCTOS = [];

function validarProductos(productos) {
    if (!Array.isArray(productos)) {
        throw new Error('El catálogo debe ser una lista de productos.');
    }

    const ids = new Set();
    return productos.map((producto, indice) => {
        const numero = indice + 1;
        if (!producto || typeof producto !== 'object' || Array.isArray(producto)) {
            throw new Error(`El producto ${numero} debe ser un objeto.`);
        }
        if (!Number.isSafeInteger(producto.id) || producto.id < 1 || ids.has(producto.id)) {
            throw new Error(`El producto ${numero} debe tener un id entero, positivo y único.`);
        }
        if (['nombre', 'categoria', 'descripcion', 'imagen'].some(
            (campo) => typeof producto[campo] !== 'string' || producto[campo].trim() === ''
        )) {
            throw new Error(`El producto ${numero} debe incluir nombre, categoría, descripción e imagen.`);
        }
        if (typeof producto.precio !== 'number' || !Number.isFinite(producto.precio) || producto.precio < 0) {
            throw new Error(`El precio del producto ${numero} debe ser un número positivo.`);
        }

        ids.add(producto.id);
        return producto;
    });
}

const PRODUCTOS_LISTOS = fetch('data/productos.json?v=20261006-1')
    .then((respuesta) => {
        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar data/productos.json (HTTP ${respuesta.status}).`);
        }
        return respuesta.json();
    })
    .then(validarProductos)
    .then((productos) => {
        PRODUCTOS = productos;
    });
