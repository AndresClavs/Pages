# TechStore Pro - Carrito de compras (2 páginas)

Tienda en línea de tecnología con **catálogo** (`index.html`) y **carrito + compra** (`carrito.html`), hecha con HTML5 semántico, CSS3 responsive y JavaScript ES6+ puro. Los productos se cargan desde `data/productos.json` mediante `fetch`; no usa módulos ni librerías externas.

**Demo web:** [TechStore Pro en GitHub Pages](https://andresclavs.github.io/Pages/techstore-v2/)

## Cómo abrirlo con la terminal

Como el catálogo se carga desde un archivo JSON, abre el proyecto con un servidor local (no directamente con `file://`). Desde la carpeta del proyecto:

```
python -m http.server 8000
```

Luego abre http://localhost:8000.

## Estructura de carpetas

```
techstore-v2/
├── index.html           # Página 1: catálogo, búsqueda y filtros
├── carrito.html         # Página 2: carrito, formulario y compra
├── README.md
├── assets/
│   ├── styles.css       # Estilos responsive (Grid + Flexbox)
│   └── img/placeholder.svg
├── data/
│   ├── productos.json   # Catálogo (9 productos) en formato JSON
│   └── productos.js     # Carga y valida el catálogo JSON
└── js/
    ├── cart.js          # Modelo del carrito + persistencia (localStorage, sessionStorage, cookies)
    ├── ui.js            # Utilidades compartidas: formato, toast, contador
    ├── catalogo.js      # Lógica de index.html
    └── checkout.js      # Lógica de carrito.html (cantidades, validaciones, popups)
```

## Explicación técnica

- **Catálogo:** los productos están en `data/productos.json`. Para agregar uno, añade un objeto con `id` único (entero positivo), `nombre`, `categoria`, `descripcion`, `precio` (número) e `imagen` (URL) al arreglo. El cargador valida los datos antes de mostrarlos. Cada producto se dibuja con `tarjetaHTML()` (tarjeta reutilizable con imagen, categoría, descripción, precio y botón). Incluye búsqueda por texto y filtro por categoría.
- **Carrito:** añadir (catálogo), aumentar/disminuir cantidad (1 a 99), eliminar y vaciar (carrito). Subtotal, IVA (15%) y total se calculan en centavos para evitar errores de decimales. Las dos páginas comparten el mismo carrito.
- **Popups:** se usan elementos nativos `<dialog>` con `showModal()`: confirmación de "Vaciar carrito" y resumen de "Compra realizada". Un mensaje flotante (toast) avisa al añadir o eliminar productos.
- **Validaciones (regex):** nombre y apellido, correo y teléfono. Se validan al salir del campo, al escribir (una vez tocado) y al enviar.
- **Seguridad:** el texto dinámico se escapa con `esc()` y el carrito solo guarda `id` y `cantidad`; los datos del producto salen siempre del catálogo.

## Persistencia (3 mecanismos)

| Mecanismo | Uso |
|---|---|
| `localStorage` | Carrito, fecha de última actualización y último pedido. Sobrevive a recargas y cierres. |
| `sessionStorage` | Borradores del formulario (nombre, correo, teléfono) mientras la pestaña esté abierta. |
| Cookies | `ultima_visita` (30 días), mostrada en el catálogo. |

La fecha y hora de la última modificación del carrito se muestra en el resumen del pedido.

## Accesibilidad

- HTML semántico: `header`, `nav`, `main`, `section`, `footer`; un `h1` por página y jerarquía lógica.
- Enlace "Saltar al contenido principal", foco visible, navegación completa por teclado y `aria-current` en la página activa.
- Formulario con `label`, `aria-required`, `aria-invalid`, `aria-describedby` (ayuda + error) y errores con `role="alert"`; el foco va al primer campo inválido.
- Popups con `<dialog>`: el foco queda atrapado dentro, se cierran con Esc, tienen `aria-labelledby`/`aria-describedby` y al cerrar el foco vuelve al título de la página.
- Mensajes con `role="status"` y región `aria-live` para anunciar cambios de cantidad, productos añadidos o eliminados.
- Botones con `aria-label` descriptivos, filtros con `aria-pressed`, contraste AA, objetivos táctiles de 44 px y `prefers-reduced-motion` respetado.
- Todas las imágenes tienen texto alternativo (las decorativas del carrito usan `alt=""`) e imagen de respaldo si falla la carga.

## Diseño responsive

Mobile-first. La cuadrícula de productos usa `repeat(auto-fill, minmax(250px, 1fr))`; en escritorio el carrito se divide en dos columnas (productos a la izquierda, resumen y formulario a la derecha), y en móvil todo se apila.
