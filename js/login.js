// inicio de sesion con supabase

const formLogin = document.getElementById("form-login");
const mensaje = document.getElementById("mensaje");
const botonEnviar = document.getElementById("boton-enviar");

// a donde devuelve despues de iniciar sesion
const parametros = new URLSearchParams(window.location.search);
const volver = parametros.get("volver");

function irDespuesDelLogin() {
    if (volver === "carrito") {
        window.location.href = "carrito.html";
    } else if (volver === "mis-compras") {
        window.location.href = "mis-compras.html";
    } else {
        window.location.href = "index.html";
    }
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "auth-mensaje " + tipo;
}


if (volver === "carrito") {
    mostrarMensaje("Iniciá sesión para poder pagar tu carrito.", "info");
} else if (volver === "mis-compras") {
    mostrarMensaje("Iniciá sesión para ver tus compras.", "info");
}

obtenerUsuario().then(function (usuario) {
    if (usuario) {
        irDespuesDelLogin();
    }
});

formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Entrando...";

    let error;
    try {
        const respuesta = await cliente.auth.signInWithPassword({
            email: email,
            password: password
        });
        error = respuesta.error;
    } catch (e) {
        error = { message: e.message || "Error de conexión con Supabase" };
    }

    if (error) {
        if (error.message.includes("Email not confirmed")) {
            mostrarMensaje("Todavía no confirmaste tu email. Revisá tu bandeja de entrada (y el spam).", "error");
        } else if (error.message.includes("Invalid login credentials")) {
            mostrarMensaje("Email o contraseña incorrectos.", "error");
        } else {
            console.log("Error de login:", error);
            mostrarMensaje("No se pudo iniciar sesión (" + error.message + ").", "error");
        }
        botonEnviar.disabled = false;
        botonEnviar.textContent = "Entrar";
        return;
    }

    irDespuesDelLogin();
});