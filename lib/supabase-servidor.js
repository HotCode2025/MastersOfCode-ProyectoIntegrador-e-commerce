function headersSupabase() {
    const clave = process.env.SUPABASE_SECRET_KEY;
    const headers = {
        "apikey": clave,
        "Content-Type": "application/json"
    };
    if (clave.startsWith("eyJ")) {
        headers["Authorization"] = "Bearer " + clave;
    }
    return headers;
}

// devuelve el usuario que mando la peticion
async function obtenerUsuario(req) {
    const authorization = req.headers.authorization || "";
    const token = authorization.replace("Bearer ", "");

    if (!token) {
        return null;
    }

    const respuesta = await fetch(process.env.SUPABASE_URL + "/auth/v1/user", {
        headers: {
            "apikey": process.env.SUPABASE_SECRET_KEY,
            "Authorization": "Bearer " + token
        }
    });

    if (!respuesta.ok) {
        return null;
    }

    return await respuesta.json();
}

//Busca el pago en mercadopago y si esta aprobado lo guarda en compras
async function guardarCompra(paymentId, usuarioEsperado) {
    const respuesta = await fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
        headers: { "Authorization": "Bearer " + process.env.MP_ACCESS_TOKEN }
    });

    if (!respuesta.ok) {
        return { guardada: false, motivo: "No se encontró el pago" };
    }

    const pago = await respuesta.json();

    if (pago.status !== "approved") {
        return { guardada: false, motivo: "El pago no está aprobado" };
    }

    // en external_reference guardamos el id del usuario al crear el pago
    if (!pago.external_reference) {
        return { guardada: false, motivo: "El pago no tiene usuario" };
    }

    if (usuarioEsperado && pago.external_reference !== usuarioEsperado) {
        return { guardada: false, motivo: "El pago es de otro usuario" };
    }

    // los productos que se pagaron
    let items = [];
    if (pago.additional_info && pago.additional_info.items) {
        items = pago.additional_info.items;
    }

    const productos = items.map(function (item) {
        return {
            nombre: item.title,
            cantidad: Number(item.quantity),
            precio: Number(item.unit_price)
        };
    });

    // si el pago ya estaba guardado no lo duplica (El numero de payment_id es unico)
    const headers = headersSupabase();
    headers["Prefer"] = "resolution=ignore-duplicates,return=minimal";

    const guardar = await fetch(process.env.SUPABASE_URL + "/rest/v1/compras?on_conflict=payment_id", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            user_id: pago.external_reference,
            payment_id: String(pago.id),
            estado: pago.status,
            total: pago.transaction_amount,
            productos: productos
        })
    });

    if (!guardar.ok) {
        console.log("Error al guardar la compra:", await guardar.text());
        return { guardada: false, motivo: "Error al guardar en la base de datos" };
    }

    return { guardada: true };
}

module.exports = { obtenerUsuario, guardarCompra };
