// muestra las compras del usuario (solo si inicio sesion)

const cargando = document.getElementById("cargando");
const sinCompras = document.getElementById("sin-compras");
const listaCompras = document.getElementById("lista-compras");

function formatoFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

async function mostrarCompras() {
    const usuario = await obtenerUsuario();

    // si no inicio sesion lo mandamos al login
    if (!usuario) {
        window.location.href = "login.html?volver=mis-compras";
        return;
    }

    // supabase solo devuelve las compras de este usuario
    const { data, error } = await cliente
        .from("compras")
        .select("*")
        .order("created_at", { ascending: false });

    cargando.style.display = "none";

    if (error) {
        listaCompras.innerHTML = "<p class='compras-error'>No se pudieron cargar tus compras. Probá de nuevo más tarde.</p>";
        return;
    }

    if (data.length === 0) {
        sinCompras.style.display = "block";
        return;
    }

    data.forEach(function (compra) {
        let productosHTML = "";
        compra.productos.forEach(function (producto) {
            productosHTML += `
                <li>
                    <span>${producto.cantidad} x ${producto.nombre}</span>
                    <span>${formatoPrecio(producto.precio * producto.cantidad)}</span>
                </li>
            `;
        });

        listaCompras.innerHTML += `
            <div class="compra">
                <div class="compra-cabecera">
                    <div>
                        <p class="compra-fecha">${formatoFecha(compra.created_at)}</p>
                        <p class="compra-numero">Pago N° ${compra.payment_id}</p>
                    </div>
                    <span class="compra-estado">Aprobado</span>
                </div>
                <ul class="compra-productos">
                    ${productosHTML}
                </ul>
                <div class="compra-total">
                    <span>Total</span>
                    <span>${formatoPrecio(Number(compra.total))}</span>
                </div>
            </div>
        `;
    });
}

mostrarCompras();