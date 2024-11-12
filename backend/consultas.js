const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "123456",
  database: "softjobs",
  allowExitOnIdle: true,
});

const registroUsuario = async (email, password, rol, lenguage) => {
  try {
    const passEncriptada = bcrypt.hashSync(password);
    password = passEncriptada;
    const insert = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
    const values = [email, passEncriptada, rol, lenguage];
    await pool.query(insert, values);
  } catch (err) {
    throw { code: 404, message: "No se logro registrar usuario", err };
  }
};

const inicioSesion = async (email, password) => {
  
    const consulta =
      "SELECT * FROM usuarios WHERE email = $1";
    const values = [email];
    const {rows:[usuario], rowCount} = await pool.query(consulta,values);
    
    if(!usuario)
        throw {code: 406, message: "Usuario no encontrado"}
    
    const{password: passEncriptada} = usuario;
    const passVerificada = bcrypt.compareSync(password, passEncriptada);

  if(!passVerificada)
    throw {code: 406, message: "Contraseña incorrecta"}
 
  return usuario;
};

const getUsuarios = async (email)=>{
        const consulta =
        "SELECT email, rol, lenguage FROM usuarios WHERE email = $1;";
        const values = [email];
        const {rows} = await pool.query(consulta, values);
    if(!rows.length)
        throw {code: 406, message: "No se encuentra coincidendia de usuarios"}
    return [rows[0]];

};

module.exports = { registroUsuario, inicioSesion, getUsuarios };
