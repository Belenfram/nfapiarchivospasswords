class Producto{
    constructor(id, data){//data es todo lo demás
        this.bandera=0;
        this.id=id;
        this.nombre=data.nombre; //es como el método set del nombre
        this.precio=data.precio;
        this.cantidad=data.cantidad;
        this.foto=data.foto;
    }

    set id(id){
        if(id!=null){
            id.length>0?this._id=id:this.bandera=1;
        }
    }
    set nombre(nombre){
        nombre.length>0?this._nombre=nombre:this.bandera=1;
    }
    set precio(precio){
        precio>0?this._precio=precio:this.bandera=1;
    }
    set cantidad(cantidad){
        cantidad>0?this._cantidad=cantidad:this.bandera=1;
    }
    set foto(foto){
        foto.length>0?this._foto=foto:this.bandera=1;
    }

    get id(){
        return this._id;
    }
    get nombre(){
        return this._nombre;
    }
    get precio(){
        return this._precio;
    }
    get cantidad(){
        return this._cantidad;
    }
    get foto(){
        return this._foto;
    }
    get obtenerProducto(){
        if(this._id!=null){
            return {
                id:this.id,
                nombre:this.nombre,
                precio:this.precio,
                cantidad:this.cantidad,
                foto:this.foto
            }
        } else{
            return {
                nombre:this.nombre,
                precio:this.precio,
                cantidad:this.cantidad,
                foto:this.foto
            }  
        }
    }
}

module.exports=Producto;