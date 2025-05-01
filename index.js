// Esperamos a que el DOM se cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos los elementos del DOM que necesitamos
    const iconoCarrito = document.querySelector('.icon-cart');
    const contenedorCarrito = document.querySelector('.container-cart-products');
    const contadorProductos = document.querySelector('#contador-productos');
    const totalPagar = document.querySelector('.total-pagar');
    const containerCartProducts = document.querySelector('.container-cart-products');
    const botonesAgregar = document.querySelectorAll('.info-product button');
    const containerItems = document.querySelector('.container-items');
    
    // Array para almacenar los productos en el carrito
    let carrito = [];
    
    // ---- FUNCIONALIDAD DEL CARRITO ----
    
    // Mostramos u ocultamos el carrito al hacer clic en el icono
    iconoCarrito.addEventListener('click', function() {
        contenedorCarrito.classList.toggle('hidden-cart');
    });
    
    // Añadimos un evento click a cada botón "Añadir al carrito"
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', function() {
            // Obtenemos el elemento item que contiene toda la información del producto
            const item = this.closest('.item');
            
            // Obtenemos el nombre y precio del producto
            const nombreProducto = item.querySelector('h2').textContent;
            const precioProducto = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
            
            // Añadimos el producto al carrito
            agregarProductoAlCarrito(nombreProducto, precioProducto);
        });
    });
    
    // Función para añadir un producto al carrito
    function agregarProductoAlCarrito(nombre, precio) {
        // Verificamos si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);
        
        if (productoExistente) {
            // Si ya existe, incrementamos la cantidad
            productoExistente.cantidad++;
        } else {
            // Si no existe, lo agregamos al carrito
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }
        
        // Actualizamos la visualización del carrito
        actualizarCarrito();
    }
    
    // Función para actualizar el carrito visualmente
    function actualizarCarrito() {
        // Limpiamos el contenido actual del carrito excepto el total
        limpiarCarritoHTML();
        
        // Contamos el total de productos en el carrito
        let totalProductos = 0;
        let totalImporte = 0;
        
        carrito.forEach(producto => {
            totalProductos += producto.cantidad;
            totalImporte += producto.precio * producto.cantidad;
            
            // Creamos el HTML para cada producto en el carrito
            const divProducto = document.createElement('div');
            divProducto.classList.add('cart-product');
            
            divProducto.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${producto.cantidad}</span>
                    <p class="titulo-producto-carrito">${producto.nombre}</p>
                    <span class="precio-producto-carrito">$${producto.precio}</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="icon-close"
                    data-nombre="${producto.nombre}"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            `;
            
            // Insertamos el producto antes del div con la clase "cart-total"
            const cartTotal = containerCartProducts.querySelector('.cart-total');
            containerCartProducts.insertBefore(divProducto, cartTotal);
        });
        
        // Actualizamos el contador de productos
        contadorProductos.textContent = totalProductos;
        
        // Actualizamos el total a pagar
        totalPagar.textContent = `$${totalImporte}`;
        
        // Guardamos el carrito en localStorage para persistencia
        guardarCarritoLocalStorage();
    }
    
    // Función para limpiar el HTML del carrito
    function limpiarCarritoHTML() {
        // Seleccionamos todos los productos en el carrito
        const productosCarrito = containerCartProducts.querySelectorAll('.cart-product');
        
        // Eliminamos cada producto
        productosCarrito.forEach(producto => {
            producto.remove();
        });
    }
    
    // Función para eliminar un producto del carrito
    function eliminarProducto(e) {
        if (e.target.classList.contains('icon-close') || e.target.closest('.icon-close')) {
            const iconClose = e.target.classList.contains('icon-close') 
                ? e.target 
                : e.target.closest('.icon-close');
                
            const nombre = iconClose.getAttribute('data-nombre');
            
            // Filtramos el producto a eliminar
            carrito = carrito.filter(producto => {
                if (producto.nombre === nombre) {
                    if (producto.cantidad > 1) {
                        producto.cantidad--;
                        return true;
                    }
                    return false;
                }
                return true;
            });
            
            // Actualizamos el carrito
            actualizarCarrito();
        }
    }
    
    // Event listener para eliminar productos
    containerCartProducts.addEventListener('click', eliminarProducto);
    
    // Funciones para guardar y cargar el carrito de localStorage
    function guardarCarritoLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
    
    function cargarCarritoLocalStorage() {
        // Verificamos si hay un carrito guardado
        const carritoStorage = localStorage.getItem('carrito');
        
        if (carritoStorage) {
            // Si hay un carrito guardado, lo cargamos
            carrito = JSON.parse(carritoStorage);
            actualizarCarrito();
        }
    }
    
    // Cargamos el carrito al iniciar la página
    cargarCarritoLocalStorage();
    
    // ---- FILTRO DE PRECIO ----
    
    // Función para crear el filtro de precio
    function crearFiltroPrecio() {
        // Obtenemos todos los precios de los productos
        const precios = [];
        document.querySelectorAll('.info-product .price').forEach(precioElement => {
            const precio = parseFloat(precioElement.textContent.replace('$', ''));
            precios.push(precio);
        });
        
        // Calculamos el precio mínimo y máximo
        const precioMinimo = Math.min(...precios);
        const precioMaximo = Math.max(...precios);
        
        // Creamos el contenedor del filtro
        const filtroContainer = document.createElement('div');
        filtroContainer.classList.add('filtro-precio-container');
        
        // Agregamos el HTML del filtro
        filtroContainer.innerHTML = `
            <h3>Filtrar por precio</h3>
            <div class="filtro-precio-inputs">
                <div class="filtro-precio-min">
                    <label for="precio-min">Mínimo:</label>
                    <input type="number" id="precio-min" min="0" max="${precioMaximo}" value="${precioMinimo}" step="1">
                </div>
                <div class="filtro-precio-max">
                    <label for="precio-max">Máximo:</label>
                    <input type="number" id="precio-max" min="${precioMinimo}" value="${precioMaximo}" step="1">
                </div>
            </div>
            <div class="filtro-precio-slider">
                <input type="range" id="precio-slider-min" min="0" max="${precioMaximo}" value="${precioMinimo}" step="1">
                <input type="range" id="precio-slider-max" min="${precioMinimo}" max="${precioMaximo}" value="${precioMaximo}" step="1">
            </div>
            <button id="aplicar-filtro">Aplicar filtro</button>
        `;
        
        // Insertamos el filtro antes del contenedor de productos
        document.querySelector('header').insertAdjacentElement('afterend', filtroContainer);
        
        // Elementos del filtro
        const precioMin = document.getElementById('precio-min');
        const precioMax = document.getElementById('precio-max');
        const sliderMin = document.getElementById('precio-slider-min');
        const sliderMax = document.getElementById('precio-slider-max');
        const aplicarFiltro = document.getElementById('aplicar-filtro');
        
        // Sincronizamos los inputs con los sliders
        precioMin.addEventListener('input', function() {
            sliderMin.value = this.value;
            sliderMax.min = this.value;
        });
        
        precioMax.addEventListener('input', function() {
            sliderMax.value = this.value;
            sliderMin.max = this.value;
        });
        
        sliderMin.addEventListener('input', function() {
            precioMin.value = this.value;
            precioMax.min = this.value;
        });
        
        sliderMax.addEventListener('input', function() {
            precioMax.value = this.value;
            precioMin.max = this.value;
        });
        
        // Aplicamos el filtro
        aplicarFiltro.addEventListener('click', function() {
            const min = parseFloat(precioMin.value);
            const max = parseFloat(precioMax.value);
            
            // Filtramos los productos
            filtrarProductosPorPrecio(min, max);
        });
    }
    
    // Función para filtrar los productos por precio
    function filtrarProductosPorPrecio(min, max) {
        const productos = document.querySelectorAll('.item');
        
        productos.forEach(producto => {
            const precioTexto = producto.querySelector('.price').textContent;
            const precio = parseFloat(precioTexto.replace('$', ''));
            
            // Mostramos u ocultamos los productos según el rango de precio
            if (precio >= min && precio <= max) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    }
    
    // Creamos el filtro de precio
    crearFiltroPrecio();
});
// Función para ajustar el carrito en dispositivos móviles
function optimizarCarritoParaMovil() {
    const anchoPantalla = window.innerWidth;
    const carritoContainer = document.querySelector('.container-cart-products');
    const iconoCarrito = document.querySelector('.icon-cart');
    
    // Si es un dispositivo móvil pequeño
    if (anchoPantalla <= 480) {
        // Asegurarse de que el carrito se cierre al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            if (!carritoContainer.contains(e.target) && !iconoCarrito.contains(e.target) && 
                !carritoContainer.classList.contains('hidden-cart')) {
                carritoContainer.classList.add('hidden-cart');
            }
        });
        
        // Cerrar el carrito al hacer scroll
        window.addEventListener('scroll', function() {
            if (!carritoContainer.classList.contains('hidden-cart')) {
                carritoContainer.classList.add('hidden-cart');
            }
        });
    }
}

// Función para ajustar el filtro de precio en dispositivos móviles
function optimizarFiltroParaMovil() {
    const anchoPantalla = window.innerWidth;
    const filtroContainer = document.querySelector('.filtro-precio-container');
    
    // Si es un dispositivo móvil
    if (anchoPantalla <= 768) {
        // Crear botón para mostrar/ocultar filtro
        const toggleFiltro = document.createElement('button');
        toggleFiltro.id = 'toggle-filtro';
        toggleFiltro.textContent = 'Mostrar filtros';
        toggleFiltro.classList.add('boton-toggle-filtro');
        
        // Contenedor para los filtros
        const filtroContenido = document.createElement('div');
        filtroContenido.classList.add('filtro-contenido');
        filtroContenido.style.display = 'none';
        
        // Mover el contenido del filtro al nuevo contenedor
        while (filtroContainer.firstChild) {
            filtroContenido.appendChild(filtroContainer.firstChild);
        }
        
        // Añadir botón y contenido al contenedor principal
        filtroContainer.appendChild(toggleFiltro);
        filtroContainer.appendChild(filtroContenido);
        
        // Añadir evento para mostrar/ocultar filtro
        toggleFiltro.addEventListener('click', function() {
            if (filtroContenido.style.display === 'none') {
                filtroContenido.style.display = 'block';
                toggleFiltro.textContent = 'Ocultar filtros';
            } else {
                filtroContenido.style.display = 'none';
                toggleFiltro.textContent = 'Mostrar filtros';
            }
        });
    }
}

// Llamar a las funciones de optimización para móviles
window.addEventListener('DOMContentLoaded', function() {
    optimizarCarritoParaMovil();
    optimizarFiltroParaMovil();
    
    // Volver a aplicar si cambia el tamaño de la ventana
    window.addEventListener('resize', function() {
        optimizarCarritoParaMovil();
    });
});
