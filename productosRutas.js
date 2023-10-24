var ruta=require("express").Router();
var subirArchivo=require("../middlewares/middlewares").subirArchivo;
var fs=require("fs");
var {mostrarProductos, nuevoProducto, buscarPorId, modificarProducto,borrarProducto}=require("../bd/productosBD");
const path = require("path");

ruta.get("/mostrarProductos",async (req,res)=>{
    var products = await mostrarProductos();
    //console.log(users);
    //res.end();
    res.render("productos/mostrarP",{products});//para evitar que el navegador se quede cargando
});

ruta.get("/nuevoProducto",(req,res)=>{
    res.render("productos/nuevoP");
});

ruta.post("/nuevoProducto", subirArchivo(), async (req,res)=>{
    req.body.foto=req.file.originalname;
    var error = await nuevoProducto(req.body);
    res.redirect("/mostrarProductos");
    //req.body //cuando viene la informacion a traves de un formulario es body
});

ruta.get("/editarProducto/:id", async(req,res)=>{
    var product=await buscarPorId(req.params.id);
    //res.end();
    res.render("productos/modificarP",{product});
});

ruta.post("/editarProducto", subirArchivo(), async(req,res)=>{
    try {
        var rutaImagen = path.join(__dirname, "..", "web", "images", req.body.foto);
        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
            req.body.foto = req.file.originalname;
            await modificarProducto(req.body);
        }

        res.redirect("/mostrarProductos");
    } catch (error) {
        console.error("Error al editar producto", error);
    }
});

ruta.get("/borrarProducto/:id", async(req,res)=>{
    try {
        var producto = await buscarPorId(req.params.id);
        if (producto) {
            var rutaImagen = path.join(__dirname, "..", "web", "images", producto.foto);
            if (fs.existsSync(rutaImagen)) {
                fs.unlinkSync(rutaImagen);
            }
            await borrarProducto(req.params.id);
        }
        res.redirect("/mostrarProductos");
    } catch (error) {
        console.error("Error al borrar usuario" ,error);
    }
});

module.exports=ruta;