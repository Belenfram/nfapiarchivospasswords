var ruta=require("express").Router();
var {mostrarUsuarios, nuevoUsuario, buscarPorId, modificarUsuario,borrarUsuario}=require("../bd/usuariosBD");

ruta.get("/api/",async (req,res)=>{
    var users = await mostrarUsuarios();
    if (users.length>0) {
        res.status(200).json(users);//crear la api formato json
    }else{
        res.status(400).json("Usuarios no encontrados");
    }//en cada ruta solo solo se puede utilizar un res que se ejecuta, de lo contrario marcaría error
});

ruta.post("/api/nuevoUsuario", async (req,res)=>{
    var error = await nuevoUsuario(req.body);
    if (error==0) {
        res.status(200).json("Usuario registrado correctamente");
    }else{
        res.status(400).json("Error al registrar al usuario");
    }
});

ruta.get("/api/buscarUsuarioPorId/:id", async(req,res)=>{
    var user=await buscarPorId(req.params.id);
    if (user!=undefined) {
        res.status(200).json(user);
    }else{
        res.status(400).json("Usuario no encontrado");
    }
    //res.end();
    //res.render("usuarios/modificar",{user});
});

ruta.post("/api/editarUsuario/", async(req,res)=>{
    var error=await modificarUsuario(req.body);
    if (error==0) {
        res.status(200).json("Usuario actualizado correctamente");
    }else{
        res.status(400).json("Error al actualizar al usuario");
    }
});

ruta.get("/api/borrarUsuario/:id", async(req,res)=>{
    var error = await borrarUsuario(req.params.id);
    if (error==0) {
        res.status(200).json("El usuario fue borrado");
    }else{
        res.status(400).json("Error al borrar al usuario");
    }
    //res.redirect("/");
})



module.exports=ruta;