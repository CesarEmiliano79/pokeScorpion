import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Carpetas
const subidaFolder = path.join("imagenesNoticias");
const antiguoFolder = path.join("imagenesNoticiasOld");

// Creacion de carpetas en caso de no existir
if(!fs.existsSync(subidaFolder))
    fs.mkdirSync(subidaFolder,{recursive: true});
if(!fs.existsSync(antiguoFolder))
    fs.mkdirSync(antiguoFolder,{recursive: true});

// Validacion de tipo de imagen
export const isImage = (mimetype) =>{
    // El parametro indica la naturaleza del formato
    return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mimetype)
}

const MAX_SIZE = 10 * 1024 * 1024;

// Guardar imagen desde base64
export const salvarImagenBase64 = async (imagenBase64)=>{
    const matches = imagenBase64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) throw new Error("Nel we, intentale por otro lado");
    const mimetype = matches[1];
    const data = matches[2];
    if(!isImage(mimetype)) throw new Error("Entiende que solo imagenes!");

    const buffer = Buffer.from(data, "base64"); //Dentro del buffer tirame paro de guardarlo
    if(buffer.length > MAX_SIZE)
        throw new Error("Entiende que son imagenes de pobre, pesa mucho por la resolucion");

    const ext = mimetype.split("/")[1];
    const nombreArchivo = `${crypto.randomBytes(8).toString("hex")}.${ext}`; // Generame el nombre que quieras en hexa, eso me da igual
    const nombreRuta = path.join(subidaFolder, nombreArchivo);
    await fs.promises.writeFile(nombreRuta, buffer); // De lo que me guardaste, ahora si mandamelo a la ruta que te asigno
    return nombreArchivo; // retorname en donde vas a quedar
}

export const moverImagenVieja = async (nombreArchivo) => {
    if (!nombreArchivo) return;
    const viejaRuta = path.resolve(subidaFolder, nombreArchivo);
    const nuevaRuta = path.resolve(antiguoFolder, nombreArchivo);
    if (fs.existsSync(viejaRuta)) {
        await fs.promises.rename(viejaRuta, nuevaRuta);
    }
}
