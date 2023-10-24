var conexion=require("./conexion").conexionProductos;
var Producto=require("../models/Producto");

async function mostrarProductos(){
    var products=[];
    try{
        var productos=await conexion.get();
        //console.log(usuarios);
        productos.forEach(producto => {
            //console.log(usuario.data());//recuperar informacion, .data y .id
            var producto1 = new Producto(producto.id,producto.data());
            if(producto1.bandera==0){
                products.push(producto1.obtenerProducto); //.push es para poder agregar al último elemento vacio de un arreglo
            }
        });
    }
    catch(err){
        console.log("Error al mostrar productos" + err);
        products=[];
    }
    return products;
}

async function nuevoProducto(newProduct){
    var error=1;
    try{
        var producto1=new Producto(null,newProduct);
        if(producto1.bandera==0){
            conexion.doc().set(producto1.obtenerProducto);
            error=0;
        }else{
            console.log("Datos incorrectos del formulario");
        }
    }
    catch(err){
        console.log("Error al insertar un nuevo producto "+err);
    }

    return error;
}

async function buscarPorId(id){
    var product;
    try{
       var productoBD=await conexion.doc(id).get();
       var productoObjeto=new Producto(productoBD.id, productoBD.data());
       if (productoObjeto.bandera==0) {
        product=productoObjeto.obtenerProducto;
       }
    }
    catch(err){
        console.log("Error al recuperar el producto "+err);
    }
    return product;
}

async function modificarProducto(datos){
    var error=1;
    var product=await buscarPorId(datos.id);
    if (product!=undefined) {
        var product=new Producto(datos.id, datos);
        if (product.bandera==0) {
            try {
                await conexion.doc(product.id).set(product.obtenerProducto);
                console.log("Los datos se modificaron correctamente");
                error=0;
            } catch (err) {
                console.log("Error al modificar el producto "+err);
            }
        }
    }
    return error;
}

async function borrarProducto(id){
    var error=1;
    var product=await buscarPorId(id);
    if (product!=undefined) {
        try {
            await conexion.doc(id).delete();
            console.log("Registro borrado ");
            error=0;
        } catch (err) {
            console.log("Error al borrar el producto "+err);
        }
    }
    return error;
}

module.exports={
    mostrarProductos,
    nuevoProducto,
    buscarPorId,
    modificarProducto,
    borrarProducto
}