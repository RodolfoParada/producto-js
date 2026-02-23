// Tus clases Producto y Orden se mantienen igual...
class Producto {
    static contadorProductos = 0;
    constructor(nombre, precio) {
        this._idProducto = ++Producto.contadorProductos;
        this._nombre = nombre;
        this._precio = precio;
    }

    set nombre(nuevoNombre) { this._nombre = nuevoNombre; }
    set precio(nuevoPrecio) { this._precio = nuevoPrecio; }

    get nombre() { return this._nombre; }
    get precio() { return this._precio; }
    toString() { return `${this._nombre}: $${this._precio}`; }
}

class Orden {
    static contadorOrdenes = 0;
    static get MAX_PRODUCTOS() { return 5; }
    constructor() {
        this._idOrden = ++Orden.contadorOrdenes;
        this._productos = [];
    }
    agregarProducto(producto) {
        if (this._productos.length < Orden.MAX_PRODUCTOS) {
            this._productos.push(producto);
        }
    }
    calcularTotal() {
        return this._productos.reduce((total, p) => total + p.precio, 0);
    }
  mostrarOrden() {
    let productosOrden = this._productos.map(p => `<li>${p.toString()}</li>`).join("");
    return `
        <div class="card-orden" id="orden-${this._idOrden}">
            <div class="card-header">
                <h3>Orden #${this._idOrden}</h3>
                <button class="btn-eliminar" onclick="eliminarOrden(${this._idOrden})">Eliminar Producto</button>
            </div>
            <ul>${productosOrden}</ul>
            <p><strong>Total: $${this.calcularTotal()}</strong></p>
        </div>`;
}
}

window.onload = function() {
    const historialGuardado = localStorage.getItem('historialOrdenes');
    const idProd = localStorage.getItem('ultimoIdProducto');
    const idOrd = localStorage.getItem('ultimoIdOrden');

    if (historialGuardado) {
        document.getElementById('contenedor-ordenes').innerHTML = historialGuardado;
    }
    
    // Restauramos los contadores estáticos de tus clases
    if (idProd) Producto.contadorProductos = parseInt(idProd);
    if (idOrd) Orden.contadorOrdenes = parseInt(idOrd);
};

// Lógica de prueba
const p1 = new Producto('Pantalón', 200);
const p2 = new Producto('Camisa', 100);
const p3 = new Producto('Cinturón', 50);

const orden1 = new Orden();
orden1.agregarProducto(p1);
orden1.agregarProducto(p2);

const orden2 = new Orden();
orden2.agregarProducto(p3);
orden2.agregarProducto(p1);

// Insertar en el HTML
document.getElementById('contenedor-ordenes').innerHTML = 
    orden1.mostrarOrden() + orden2.mostrarOrden();

    // ... (Tus clases Producto y Orden se mantienen igual) ...

let productosTemporales = [];
let ordenActiva = new Orden();

function manejadorAgregar() {
    const inputNombre = document.getElementById('nombreP');
    const inputPrecio = document.getElementById('precioP');
    
    if (inputNombre.value === "" || inputPrecio.value <= 0) {
        alert("Por favor, ingresa datos válidos.");
        return;
    }

    if (ordenActiva._productos.length < Orden.MAX_PRODUCTOS) {
        const nuevoP = new Producto(inputNombre.value, Number(inputPrecio.value));
        ordenActiva.agregarProducto(nuevoP);
        
        actualizarInterfaz();
        inputNombre.value = "";
        inputPrecio.value = "";
    } else {
        alert("Límite de productos alcanzado para esta orden.");
    }
}

function actualizarInterfaz() {
    const lista = document.getElementById('listaPreview');
    const total = document.getElementById('totalPreview');
    
    lista.innerHTML = ordenActiva._productos.map(p => `
        <li>
        ${p.nombre} - $${p.precio}
        <button class="btn-editar" onclick="prepararEdicion(${p._idProducto})">✏️</button>
        </li>
     `).join("");
    total.innerHTML = `Total acumulado: $${ordenActiva.calcularTotal()}`;
}

function manejadorFinalizar() {
    if (ordenActiva._productos.length === 0) return;

    // Insertar la orden en el historial
    const historial = document.getElementById('contenedor-ordenes');
    historial.innerHTML += ordenActiva.mostrarOrden();
    guardarEnLocalStorage();

    // Resetear para una nueva orden
    ordenActiva = new Orden();
    actualizarInterfaz();
}

function eliminarOrden(id) {
    const ordenAEliminar = document.getElementById(`orden-${id}`);
    if (ordenAEliminar) {
        // Efecto visual opcional antes de eliminar
        ordenAEliminar.style.opacity = '0';
        setTimeout(() => {
            ordenAEliminar.remove();
            guardarEnLocalStorage();
        }, 300);
    }
}

function prepararEdicion(id) {
    // 1. Buscamos el producto en la orden activa por su ID
    const producto = ordenActiva._productos.find(p => p._idProducto === id);

    if (producto) {
        // 2. Pedimos los nuevos datos
        const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
        const nuevoPrecio = prompt("Nuevo precio:", producto.precio);

        // 3. Validamos y actualizamos (El corazón del UPDATE)
        if (nuevoNombre && !isNaN(nuevoPrecio) && nuevoPrecio > 0) {
            producto.nombre = nuevoNombre;
            producto.precio = Number(nuevoPrecio);
            
            // 4. Refrescamos la pantalla para ver los cambios
            actualizarInterfaz();
        } else {
            alert("Datos no válidos");
        }
    }
}

function guardarEnLocalStorage() {
    const historialHTML = document.getElementById('contenedor-ordenes').innerHTML;
    localStorage.setItem('historialOrdenes', historialHTML);
    
    // También es buena idea guardar el contador para que no se repitan IDs
    localStorage.setItem('ultimoIdProducto', Producto.contadorProductos);
    localStorage.setItem('ultimoIdOrden', Orden.contadorOrdenes);
}