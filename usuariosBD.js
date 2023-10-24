var conexion=require("./conexion").conexionUsuarios;
var Usuario=require("../models/Usuario");
var { generarPassword, validarPassword } = require("../middlewares/password");
const {log} = require("console");


async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios=await conexion.get();
        //console.log(usuarios);
        usuarios.forEach(usuario => {
            //console.log(usuario.data());//recuperar informacion, .data y .id
            var usuario1 = new Usuario(usuario.id,usuario.data());
            if(usuario1.bandera==0){
                users.push(usuario1.obtenerUsuario); //.push es para poder agregar al último elemento vacio de un arreglo
            }
        });
    }
    catch(err){
        console.log("Error al mostrar usuarios" + err);
        users=[];
    }
    return users;
}

async function nuevoUsuario(datos){
    var {salt, hash} = generarPassword(datos.password);
    datos.salt=salt;
    datos.password=hash;
    var error=1;
    try{
        var usuario1=new Usuario(null,datos);
        if(usuario1.bandera==0){
            conexion.doc().set(usuario1.obtenerUsuario);
            error=0;
        }else{
            console.log("Datos incorrectos del formulario");
        }
    }
    catch(err){
        console.log("Error al crear nuevo usuario "+err);
    }

    return error;
}

async function buscarPorId(id){
    var user;
    try{
       var usuarioBD=await conexion.doc(id).get();
       var usuarioObjeto=new Usuario(usuarioBD.id, usuarioBD.data());
       if (usuarioObjeto.bandera==0) {
        user=usuarioObjeto.obtenerUsuario;
       }
    }
    catch(err){
        console.log("Error al recuperar al usuario "+err);
    }
    return user;
}

async function modificarUsuario(datos){
    var error=1;
    var user=await buscarPorId(datos.id);
    if (user!=undefined) {
        if (datos.password="") {
            datos.password=datos.passwordAnterior;
        }else{
            var {salt, hash} = generarPassword(datos.password);
            datos.salt=salt;
            datos.password=hash;
        }
        var user=new Usuario(datos.id, datos);
        if (user.bandera==0) {
            try {
                await conexion.doc(user.id).set(user.obtenerUsuario);
                console.log("Los datos se modificaron correctamente");
                error=0;
            } catch (err) {
                console.log("Error al modificar usuario "+err);
            }
        }
    }
    return error;
}

async function borrarUsuario(id){
    var error=1;
    var user=await buscarPorId(id);
    if (user!=undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Registro borrado ");
            error=0;
        } catch (err) {
            console.log("Error al borrar el usuario "+err);
        }
    }
    return error;
}

async function verificarLogin(datos){
    var user;
    var usuarioBd = await conexion.where("usuario","==",datos.usuario).get();
    if(usuarioBd.empty){
        console.log("usuario no existe");
        return user;
    }else{
        usuarioBd.forEach((doc) => {
            var validP = validarPassword(datos.password,doc.data().salt,doc.data().password);
            if(validP===false){
                console.log("Contraseña incorrecta");
                user=0; 
            }else{
                console.log("Contraseña correcta")
                user=1;
            }
        });
    }
    return user;
}

module.exports={
    mostrarUsuarios,
    nuevoUsuario,
    buscarPorId,
    modificarUsuario,
    borrarUsuario,
    verificarLogin
}