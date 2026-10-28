// agregamos los filtros de los productos de la tienda

const grilla = document.getElementById("grilla-productos");
const productos = Array.from(grilla.querySelectorAll(".producto"));
const buscador = document.getElementById("buscador");
const linksCategorias = document.querySelectorAll(".categoria-filtro");
const checkMateriales = document.querySelectorAll(".material-filtro");
const selectOrdenar = document.getElementById("ordenar");
const cantidadProductos = document.getElementById("cantidad-productos");
const sinResultados = document.getElementById("sin-resultados");

let categoriaElegida = "todos";

// sacamos los acentos y pasamos a minuscula, asi "lampara" encuentra a "Lámpara"
function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function filtrarProductos() {
    const textoBuscado = normalizar(buscador.value.trim());
    const materiales = [];
    checkMateriales.forEach(function (check) {
        if (check.checked) {
            materiales.push(check.value);
        }
    });

    let visibles = 0;

    productos.forEach(function (producto) {
        const nombre = normalizar(producto.dataset.nombre);
        const categoria = producto.dataset.categoria;
        const material = producto.dataset.material;

        const coincideTexto = nombre.includes(textoBuscado);
        const coincideCategoria = categoriaElegida === "todos" || categoria === categoriaElegida;
        const coincideMaterial = materiales.length === 0 || materiales.includes(material);

        if (coincideTexto && coincideCategoria && coincideMaterial) {
            producto.style.display = "block";
            visibles++;
        } else {
            producto.style.display = "none";
        }
    });

    if (visibles === 1) {
        cantidadProductos.textContent = "Mostrando 1 producto";
    } else {
        cantidadProductos.textContent = "Mostrando " + visibles + " productos";
    }

    sinResultados.style.display = visibles === 0 ? "block" : "none";
}

function ordenarProductos() {
    const orden = selectOrdenar.value;
    const ordenados = productos.slice();

    if (orden === "menor") {
        ordenados.sort(function (a, b) {
            return a.dataset.precio - b.dataset.precio;
        });
    } else if (orden === "mayor") {
        ordenados.sort(function (a, b) {
            return b.dataset.precio - a.dataset.precio;
        });
    } else if (orden === "nombre") {
        ordenados.sort(function (a, b) {
            return a.dataset.nombre.localeCompare(b.dataset.nombre);
        });
    }
    ordenados.forEach(function (producto) {
        grilla.appendChild(producto);
    });
}

buscador.addEventListener("input", filtrarProductos);

linksCategorias.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        linksCategorias.forEach(function (l) {
            l.classList.remove("activa");
        });
        link.classList.add("activa");
        categoriaElegida = link.dataset.categoria;
        filtrarProductos();
    });
});

checkMateriales.forEach(function (check) {
    check.addEventListener("change", filtrarProductos);
});

selectOrdenar.addEventListener("change", ordenarProductos);

// limpiamos los filtros
document.getElementById("limpiar-filtros").addEventListener("click", function () {
    buscador.value = "";
    checkMateriales.forEach(function (check) {
        check.checked = false;
    });
    linksCategorias.forEach(function (l) {
        l.classList.remove("activa");
    });
    linksCategorias[0].classList.add("activa");
    categoriaElegida = "todos";
    selectOrdenar.value = "";
    ordenarProductos();
    filtrarProductos();
});