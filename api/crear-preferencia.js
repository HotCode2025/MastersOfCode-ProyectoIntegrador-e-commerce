//Cramos el pago mediante vercel
//la secret key esta guardada dentro del servidor porque no debe filtrarse
const { obtenerUsuario } = require("../lib/supabase-servidor");

//Lista de precios para que no sean modificados
const productos = {
    1: { nombre: "Dragón articulado", precio: 9500 },
    2: { nombre: "Maceta geométrica", precio: 6200 },
    3: { nombre: "Llavero personalizado", precio: 2500 },
    4: { nombre: "Lámpara luna", precio: 14000 },
    5: { nombre: "Busto romano", precio: 11000 },
    6: { nombre: "Engranaje a medida", precio: 3800 },
    7: { nombre: "Portalápices", precio: 4200 },
    8: { nombre: "Pack 5 llaveros", precio: 9000 }
};

module.exports = async function (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    // solo pueden comprar los usuarios que iniciaron sesion
    const usuario = await obtenerUsuario(req);
    if (!usuario) {
        return res.status(401).json({ error: "Tenés que iniciar sesión" });
    }

    const carrito = req.body.items || [];

    // armamos los items con los datos del servidor
    const items = [];
    carrito.forEach(function (item) {
        const producto = productos[item.id];
        const cantidad = parseInt(item.cantidad);

        if (producto && cantidad > 0) {
            items.push({
                id: String(item.id),
                title: producto.nombre,
                quantity: cantidad,
                unit_price: producto.precio,
                currency_id: "ARS"
            });
        }
    });

    if (items.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío" });
    }

    const sitio = process.env.SITIO_URL || "https://" + req.headers.host;

    try {
        const respuesta = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.MP_ACCESS_TOKEN
            },
            body: JSON.stringify({
                items: items,
                back_urls: {
                    success: sitio + "/index.html?pago=aprobado",
                    failure: sitio + "/index.html?pago=rechazado",
                    pending: sitio + "/index.html?pago=pendiente"
                },
                auto_return: "approved",
                external_reference: usuario.id,
                notification_url: sitio + "/api/webhook-mp",
                statement_descriptor: "PRINT3D"
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            console.log("Error de Mercado Pago:", datos);
            return res.status(500).json({ error: "No se pudo crear el pago" });
        }

        res.status(200).json({ url: datos.init_point });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};
