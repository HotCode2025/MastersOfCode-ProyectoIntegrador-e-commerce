const { obtenerUsuario, guardarCompra } = require("../lib/supabase-servidor");

module.exports = async function (req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    const usuario = await obtenerUsuario(req);
    if (!usuario) {
        return res.status(401).json({ error: "Tenés que iniciar sesión" });
    }

    const paymentId = req.body.payment_id;
    if (!paymentId) {
        return res.status(400).json({ error: "Falta el número de pago" });
    }

    try {
        const resultado = await guardarCompra(paymentId, usuario.id);
        res.status(200).json(resultado);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};
