var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var fs=require("fs");
var {mostrarUsuarios, nuevoUsuario, buscarPorId, modificarUsuario, borrarUsuario, verificarLogin}=require("../bd/usuariosBD");
const path = require("path");
const { log } = require("console");

ruta.get("/mostrarUsuario",async (req,res)=>{
    var users = await mostrarUsuarios();
    //console.log(users);
    //res.end();
    res.render("usuarios/mostrar",{users});//para evitar que el navegador se quede cargando
});

ruta.get("/nuevoUsuario",(req,res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevoUsuario", subirArchivo(), async (req,res)=>{
    //console.log(req.file.originalname);
    req.body.foto=req.file.originalname;
    var error = await nuevoUsuario(req.body);
    res.redirect("/");
    //req.body //cuando viene la informacion a traves de un formulario es body
});

ruta.get("/editarUsuario/:id", async(req,res)=>{
    var user=await buscarPorId(req.params.id);
    //res.end();
    res.render("usuarios/modificar",{user});
});

ruta.post("/editarUsuario",subirArchivo(), async(req,res)=>{
    //console.log("req.body");
    if (req.file!=undefined) {
        req.body.foto=req.file.originalname;
    }else{
        req.body.foto=req.body.fotoVieja;
    }
    var error=await modificarUsuario(req.body);
    res.redirect("/");
    /*try {
        var rutaImagen = path.join(__dirname, "..", "web", "images", req.body.foto);
        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
            req.body.foto = req.file.originalname;
            await modificarUsuario(req.body);
        }

        res.redirect("/");
    } catch (error) {
        console.error("Error al editar usuario", error);
    }*/
});

ruta.get("/borrarUsuario/:id", async(req,res)=>{
    try {
        var usuario = await buscarPorId(req.params.id);
        if (usuario) {
            var rutaImagen = path.join(__dirname, "..", "web", "images", usuario.foto);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
            }
            await borrarUsuario(req.params.id);
        }
        res.redirect("/");
    } catch (error) {
        console.error("Error al borrar usuario" ,error);
    }
});

ruta.get("/",(req,res)=>{
    res.render("usuarios/login");
});

ruta.post("/login", async(req,res)=>{
    var user = await verificarLogin(req.body);
    if(user === 1){
        res.redirect("/mostrarUsuario");
    }else if(user === 0){
        res.status(400).send({ error: "Contraseña no valida" });
    }else if(user === null){
        res.status(400).send({ error: "El usuario no existe" });
    }
});
  

module.exports=ruta;