// mostramos los productos del carrito y manda a pagar

const lista = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const carritoLleno = document.getElementById("carrito-lleno");
const botonPagar = document.getElementById("boton-pagar");
const mensajePago = document.getElementById("mensaje-pago");

function mostrarCarrito() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        carritoVacio.style.display = "block";
        carritoLleno.style.display = "none";
        return;
    }

    carritoVacio.style.display = "none";
    carritoLleno.style.display = "flex";
    lista.innerHTML = "";

    let total = 0;
    let cantidad = 0;

    carrito.forEach(function (producto) {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        cantidad += producto.cantidad;

        lista.innerHTML += `
            <div class="item-carrito">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="item-info">
                    <h3>${producto.nombre}</h3>
                    <p>${formatoPrecio(producto.precio)} c/u</p>
                </div>
                <div class="item-cantidad">
                    <button onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                    <span>${producto.cantidad}</span>
                    <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                </div>
                <p class="item-subtotal">${formatoPrecio(subtotal)}</p>
                <button class="item-borrar" onclick="borrarProducto(${producto.id})">Quitar</button>
            </div>
        `;
    });

    document.getElementById("resumen-cantidad").textContent = cantidad;
    document.getElementById("resumen-total").textContent = formatoPrecio(total);
}

function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();
    const producto = carrito.find(function (p) {
        return p.id === id;
    });

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        borrarProducto(id);
        return;
    }

    guardarCarrito(carrito);
    mostrarCarrito();
}

function borrarProducto(id) {
    const carrito = obtenerCarrito().filter(function (p) {
        return p.id !== id;
    });
    guardarCarrito(carrito);
    mostrarCarrito();
}

document.getElementById("boton-vaciar").addEventListener("click", function () {
    guardarCarrito([]);
    mostrarCarrito();
});

// pagar con mercado pago
botonPagar.addEventListener("click", async function () {
    const token = await obtenerToken();
    if (!token) {
        mensajePago.textContent = "Tenés que iniciar sesión para pagar.";
        setTimeout(function () {
            window.location.href = "login.html?volver=carrito";
        }, 1500);
        return;
    }

    const carrito = obtenerCarrito();

    // al servidor solo le mandamos el id y la cantidad, Los precios los hemos guardado dentro del servidor para que no sean
    //modificados mediante inspeccionar
    const items = carrito.map(function (p) {
        return { id: p.id, cantidad: p.cantidad };
    });

    botonPagar.disabled = true;
    botonPagar.textContent = "Cargando...";
    mensajePago.textContent = "";

    try {
        const respuesta = await fetch("/api/crear-preferencia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ items: items })
        });

        const datos = await respuesta.json();

        if (datos.url) {
            window.location.href = datos.url;
        } else {
            mensajePago.textContent = "No se pudo iniciar el pago. Probá de nuevo.";
        }
    } catch (error) {
        mensajePago.textContent = "Error de conexión. Probá de nuevo.";
    }

    botonPagar.disabled = false;
    botonPagar.textContent = "Pagar con Mercado Pago";
});

mostrarCarrito();
