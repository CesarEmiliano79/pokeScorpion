import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {DBconnection} from './src/services/DBConnection.service.js'
import autenticacion from './src/routes/autenticacion.route.js';
import noticia from './src/routes/noticia.route.js';
import pokemones from './src/routes/pokemon.route.js';
import nosotros from './src/routes/nosotros.route.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
//Rutas
app.use("/api/autenticacion", autenticacion);
// app.use("/api/incio", inicio);
app.use("/api/noticias", noticia);
app.use("/api/pokemones", pokemones);
app.use("/api/ubicacion", nosotros);
// app.use("/juegos", juegos);
const uploadFolder = path.join("imagenesNoticias");
app.use("/imagenesNoticias", express.static(uploadFolder));
// Si no existe la ruta
app.use((req, res, next) => {
    res.status(404).json({ 
        status: 404, 
        message: "Página no encontrada" 
    });
});

// Por si se cae el server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, message: "Error en el servidor" });
});

// Corre el servicio
app.listen(PORT, ()=>{
    DBconnection();
    console.log("Servidor Corriendo desde ", PORT);
})