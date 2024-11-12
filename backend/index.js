const express = require("express");
const app = express();
const cors= require("cors");
const jwt = require("jsonwebtoken");
const { registroUsuario, inicioSesion, getUsuarios } = require("./consultas");

app.use(cors());
app.use(express.json());
app.listen(3000,  console.log("Servidor levantado"));

app.post("/usuarios", async (req, res)=>{
    try{
        const {email, password, rol, lenguage} = req.body;
        await registroUsuario(email, password, rol, lenguage);
        res.status(201).json("Usuario ingresado");
    }catch(err){
        res.status(err.code || 500).send(err);
    }
});

app.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        await inicioSesion(email,password);
        const token = jwt.sign({email},"az_AZ",{expiresIn : 600});
        res.json({token});
        console.log({token});
    }catch(err){
        console.log(err)
        res.status(err.code || 500).send(err);     
    }
});

app.get("/usuarios", async (req, res)=>{
    try{
        const Authorization = req.header("Authorization");
        if(!Authorization){
            return res.status(406).json({err: "No autorizado"})
        }
        const token = Authorization.split("Bearer ")[1];
        if(!token){
            return res.status(406).json({err : "No autorizado"})
        }
        jwt.verify(token,"az_AZ");
        const { email } = jwt.decode(token);
         const user = await getUsuarios(email);
         res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(err.code || 500).send(err);
        
    }
});