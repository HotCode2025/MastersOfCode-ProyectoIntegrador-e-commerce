//esto sirve por si el cliente paga y cierra la pagina antes de volver a la tienda
//nos avisa cada vez que cambia un pago
const { guardarCompra } = require("../lib/supabase-servidor");

module.exports = async function (req, res) {
    const cuerpo = req.body || {};
    const tipo = cuerpo.type || req.query.type || req.query.topic;
    let paymentId = req.query["data.id"] || req.query.id;
    if (cuerpo.data && cuerpo.data.id) {
        paymentId = cuerpo.data.id;
    }

    if (tipo === "payment" && paymentId) {
        try {
            await guardarCompra(paymentId);
        } catch (error) {
            console.log("Error en el webhook:", error);
        }
    }

    res.status(200).send("OK");
};
