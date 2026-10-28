const parametros = new URLSearchParams(window.location.search);
const estadoPago = parametros.get("pago");
const aviso = document.getElementById("aviso-pago");
const textoAviso = document.getElementById("texto-aviso");

function mostrarAviso(html, tipo) {
    textoAviso.innerHTML = html;
    aviso.classList.add(tipo);
    aviso.style.display = "block";
}

// guarda la compra en la seccion de "Mis compras"
async function confirmarCompra(paymentId) {
    const token = await obtenerToken();
    if (!token || !paymentId) return;

    try {
        await fetch("/api/confirmar-pago", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ payment_id: paymentId })
        });
    } catch (error) {
        console.log(error);
    }
}

if (estadoPago === "aprobado") {
    mostrarAviso("¡Gracias por tu compra! Tu pago se realizó correctamente. <a href='mis-compras.html'>Ver mis compras</a>", "aviso-ok");
    // el pago salio bien y vaciamos el carrito
    localStorage.removeItem("carrito");
    actualizarContador();
    // mercado pago agrega el numero de pago en la direccion (payment_id)
    confirmarCompra(parametros.get("payment_id"));
} else if (estadoPago === "pendiente") {
    mostrarAviso("Tu pago está pendiente. Cuando se confirme vamos a preparar tu pedido.", "aviso-pendiente");
    localStorage.removeItem("carrito");
    actualizarContador();
} else if (estadoPago === "rechazado") {
    mostrarAviso("No se pudo completar el pago. Tus productos siguen en el carrito.", "aviso-error");
}

if (parametros.get("verificado") === "1") {
    mostrarAviso("¡Tu cuenta fue confirmada! Ya podés comprar en Print3d.", "aviso-ok");
}
