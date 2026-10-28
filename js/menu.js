// abre y cierra el menu hamburguesa
const botonMenu = document.querySelector(".boton-menu");
const headerLinks = document.querySelector(".header-links");

botonMenu.addEventListener("click", function () {
    headerLinks.classList.toggle("abierto");
    botonMenu.classList.toggle("activo");
});
