//Conexion con la base de datos, implementamos un base de datos relacional en la nube basada en postgreeSQL
//Aqui solo pondremos los datos visibles para el publico (Public key) y en la parte del servidor (Vercel)
//incorporaremos la clave secreta para que no sea visible para proteger el acceso.
const SUPABASE_URL = "https://xvtsrjlzsiuoninlunqt.supabase.co";
const SUPABASE_KEY = "sb_publishable_lUWmrCtQ_uXMdepF6UvC8A_EMtCrxQy";

const cliente = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
