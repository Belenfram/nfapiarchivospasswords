var ruta=require("express").Router();
var {mostrarProductos, nuevoProducto, buscarPorId, modificarProducto,borrarProducto}=require("../bd/productosBD");

ruta.get("/api/mostrarProductos",async (req,res)=>{
    var products = await mostrarProductos();
    if (products.length>0) {
        res.status(200).json(products);//crear la api formato json
    }else{
        res.status(400).json("Productos no encontrados");
    }
});

ruta.post("/api/nuevoProducto", async (req,res)=>{
    var error = await nuevoProducto(req.body);
    if (error==0) {
        res.status(200).json("Producto registrado correctamente");
    }else{
        res.status(400).json("Error al registrar al producto");
    }
});

ruta.get("/api/buscarProductoPorId/:id", async(req,res)=>{
    var product=await buscarPorId(req.params.id);
    if (product!=undefined) {
        res.status(200).json(product);
    }else{
        res.status(400).json("Producto no encontrado");
    }
});

ruta.post("/api/editarProducto/", async(req,res)=>{
    var error=await modificarProducto(req.body);
    if (error==0) {
        res.status(200).json("Producto actualizado correctamente");
    }else{
        res.status(400).json("Error al actualizar al producto");
    }
});

ruta.get("/api/borrarProducto/:id", async(req,res)=>{
    var error = await borrarProducto(req.params.id);
    if (error==0) {
        res.status(200).json("El producto fue borrado");
    }else{
        res.status(400).json("Error al borrar al producto");
    }
})


module.exports=ruta;