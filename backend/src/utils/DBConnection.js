import mongoose from "mongoose";
export const DBconnection = async() =>{
    try {
        console.log(`intentando acceder a ${process.env.DBMONGO}`)
        await mongoose.connect(process.env.DBMONGO);
        console.log("Conexion correcta");
    } catch (error) {
        console.log("Fallo la conexión");
    }
}