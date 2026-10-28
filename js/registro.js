const formRegistro = document.getElementById("form-registro");
const mensaje = document.getElementById("mensaje");
const botonEnviar = document.getElementById("boton-enviar");

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = "auth-mensaje " + tipo;
}

obtenerUsuario().then(function (usuario) {
    if (usuario) {
        window.location.href = "index.html";
    }
});

formRegistro.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if (password !== password2) {
        mostrarMensaje("Las contraseñas no coinciden.", "error");
        return;
    }

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Creando cuenta...";

    let data, error;
    try {
        const respuesta = await cliente.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { username: usuario },
                emailRedirectTo: "https://print3dd.shop/index.html?verificado=1"
            }
        });
        data = respuesta.data;
        error = respuesta.error;
    } catch (e) {
        error = { message: e.message || "Error de conexión con Supabase" };
    }

    botonEnviar.disabled = false;
    botonEnviar.textContent = "Registrarme";

    if (error) {
        console.log("Error de registro:", error);
        if (error.message.includes("Password")) {
            mostrarMensaje("La contraseña tiene que tener al menos 6 caracteres.", "error");
        } else if (error.message.includes("rate limit")) {
            mostrarMensaje("Se enviaron demasiados emails. Esperá unos minutos y probá de nuevo.", "error");
        } else if (error.message.includes("sending") || error.message.includes("email")) {
            mostrarMensaje("No se pudo enviar el email de confirmación. Probá de nuevo más tarde.", "error");
        } else {
            mostrarMensaje("No se pudo crear la cuenta (" + error.message + ").", "error");
        }
        return;
    }

    if (data.user && data.user.identities && data.user.identities.length === 0) {
        mostrarMensaje("Ya existe una cuenta con ese email. Probá iniciar sesión.", "error");
        return;
    }

    formRegistro.reset();
    formRegistro.style.display = "none";
    mostrarMensaje("¡Listo " + usuario + "! Te enviamos un email a " + email + ". Tocá el link que te llegó para activar tu cuenta (si no lo ves, revisá el spam).", "ok");
});