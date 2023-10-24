//archivo encargado de conectar la base de firebase
var admin=require("firebase-admin");
var keys=require("../serviceAcountKeys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var cuenta=admin.firestore();

var conexionUsuarios=cuenta.collection("miejemploBD"); //nombre de la base de datos
var conexionProductos=cuenta.collection("productos");

module.exports={
    conexionUsuarios,
    conexionProductos
}