// carrito de compras guardado en el navegador (usamos localStorage)

function obtenerCarrito() {
    const carrito = localStorage.getItem("carrito");
    if (carrito) {
        return JSON.parse(carrito);
    }
    return [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
}

function actualizarContador() {
    const contador = document.getElementById("contador");
    if (!contador) return;

    let cantidad = 0;
    obtenerCarrito().forEach(function (producto) {
        cantidad += producto.cantidad;
    });
    contador.textContent = cantidad;
}

function agregarAlCarrito(id, nombre, precio, imagen) {
    const carrito = obtenerCarrito();
    const existe = carrito.find(function (producto) {
        return producto.id === id;
    });

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ id: id, nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }

    guardarCarrito(carrito);
}

function formatoPrecio(numero) {
    return "$" + numero.toLocaleString("es-AR");
}

// botones de "Agregar al carrito"
document.querySelectorAll(".boton-comprar").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const tarjeta = boton.closest(".producto");
        const imagen = tarjeta.querySelector("img").getAttribute("src");

        agregarAlCarrito(
            Number(boton.dataset.id),
            boton.dataset.nombre,
            Number(boton.dataset.precio),
            imagen
        );

        boton.textContent = "¡Agregado!";
        boton.classList.add("agregado");
        setTimeout(function () {
            boton.textContent = "Agregar al carrito";
            boton.classList.remove("agregado");
        }, 1000);
    });
});

actualizarContador();
