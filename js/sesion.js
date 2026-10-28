    async function obtenerUsuario() {
    const { data } = await cliente.auth.getSession();
    if (data.session) {
        return data.session.user;
    }
    return null;
}

async function obtenerToken() {
    const { data } = await cliente.auth.getSession();
    if (data.session) {
        return data.session.access_token;
    }
    return null;
}

async function mostrarSesion() {
    const usuario = await obtenerUsuario();

    if (usuario) {
        document.body.classList.add("logueado");
        document.getElementById("nombre-usuario").textContent = usuario.user_metadata.username || usuario.email;
    } else {
        document.body.classList.remove("logueado");
    }
}

document.getElementById("boton-salir").addEventListener("click", async function () {
    await cliente.auth.signOut();
    window.location.href = "index.html";
});

mostrarSesion();
