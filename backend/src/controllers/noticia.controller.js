import Noticia from "../models/noticia.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Carpetas de imágenes
const uploadFolder = path.join("imagenesNoticias");
const oldFolder = path.join("imagenesNoticiasOld");

// Crear carpetas si no existen
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });
if (!fs.existsSync(oldFolder)) fs.mkdirSync(oldFolder, { recursive: true });

// Función auxiliar para validar tipo de imagen
const isImage = (mimetype) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mimetype);

// Tamaño máximo de imagen (10 MB)
const MAX_SIZE = 10 * 1024 * 1024;

// Obtener una noticia por ID
export const noticia = async (req, res) => {
    try {
        const { NoticiaId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(NoticiaId)) {
            return res.status(400).json({ success: false, mensaje: "ID de noticia inválido" });
        }

        const noticia = await Noticia.findById(NoticiaId).populate("autor", "username email");
        console.log(noticia)
        if (!noticia || !noticia.esMostrable) {
            return res.status(404).json({ success: false, mensaje: "Noticia no encontrada" });
        }

        res.status(200).json({ success: true, data: noticia });
    } catch (error) {
        console.error("Error en noticia:", error.message);
        res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
    }
};

// Obtener todas las noticias visibles
export const noticias = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);

        if (!Number.isInteger(page) || !Number.isInteger(limit)) {
            return res.status(400).json({ success: false, mensaje: "Los parámetros deben ser enteros" });
        }
        if (limit <= 0 || limit > 10) {
            return res.status(400).json({ success: false, mensaje: "El límite debe ser entre 1 y 10" });
        }

        const total = await Noticia.countDocuments({ esMostrable: true });
        if (total === 0) return res.status(200).json({ success: true, noticias: [], mensaje: "No hay noticias" });

        const totalPages = Math.ceil(total / limit);
        if (page <= 0 || page > totalPages) {
            return res.status(404).json({ success: false, mensaje: "Página fuera de rango" });
        }

        const allNoticias = await Noticia.find({ esMostrable: true })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ fechaCreacion: -1 })
            .populate("autor", "username");

        res.status(200).json({ success: true, noticias: allNoticias, total, totalPages });
    } catch (error) {
        console.error("Error en noticias:", error);
        res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
    }
};

// Buscar noticias por título
export const searchNoticia = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "Debes enviar un parámetro de búsqueda" });
        }

        const result = await Noticia.find({
            title: { $regex: query, $options: "i" }
        }).limit(10);

        res.status(200).json({ success: true, total: result.length, data: result });
    } catch (error) {
        console.error("Error buscando noticias:", error);
        res.status(500).json({ success: false, mensaje: "Error buscando noticias", error });
    }
};

// Agrega la nueva noticia
export const addNoticia = async (req, res) => {
  try {
    const { title, imageBase64, esMostrable = true, descripcion = "" } = req.body;

    if (!title)
        return res.status(400).json({ success: false, mensaje: "El título es obligatorio" });

    if (!req.user || !req.user.userId)
      return res.status(401).json({ success: false, mensaje: "Usuario no autenticado" });

    let filename = null;

    if (imageBase64) {
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (!matches)
        return res.status(400).json({ success: false, mensaje: "Formato de imagen inválido" });

      const mimetype = matches[1];
      const data = matches[2];

      if (!isImage(mimetype))
        return res.status(400).json({ success: false, mensaje: "Solo se permiten imágenes" });

      const buffer = Buffer.from(data, "base64");
      if (buffer.length > MAX_SIZE)
        return res.status(400).json({ success: false, mensaje: "La imagen es demasiado grande (máx 10MB)" });

      const ext = mimetype.split("/")[1];
      filename = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
      const filepath = path.join(uploadFolder, filename);

      await fs.promises.writeFile(filepath, buffer);
    }

    const nuevaNoticia = new Noticia({
      title,
      descripcion,
      image: filename,
      autor: req.user.userId,
      esMostrable,
      fechaCreacion: new Date(),
      fechaModificacion: null,
    });

    await nuevaNoticia.save();

    res.status(201).json({
      success: true,
      mensaje: "Noticia creada correctamente",
      data: nuevaNoticia,
    });
  } catch (error) {
    console.error("Error en addNoticia:", error.message);
    res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
  }
};

// Actualizar noticia (solo admin)
export const updateNoticia = async (req, res) => {
    try {
        const { NoticiaId } = req.params;
        const { title, esMostrable, imageBase64, descripcion } = req.body;

        if (!mongoose.Types.ObjectId.isValid(NoticiaId)) {
            return res.status(400).json({ success: false, mensaje: "ID de noticia inválido" });
        }

        const noticia = await Noticia.findById(NoticiaId);
        if (!noticia) return res.status(404).json({ success: false, mensaje: "Noticia no encontrada" });

        if (title) noticia.title = title;
        if (descripcion) noticia.descripcion = descripcion;
        if (esMostrable !== undefined) noticia.esMostrable = esMostrable;

        if (imageBase64) {
            const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
            if (!matches) return res.status(400).json({ success: false, mensaje: "Formato de imagen inválido" });

            const mimetype = matches[1];
            const data = matches[2];
            if (!isImage(mimetype)) return res.status(400).json({ success: false, mensaje: "Solo se permiten imágenes" });

            const buffer = Buffer.from(data, "base64");
            if (buffer.length > MAX_SIZE) {
                return res.status(400).json({ success: false, mensaje: "La imagen es demasiado grande (máx 5MB)" });
            }

            const ext = mimetype.split("/")[1];
            const newFilename = `${crypto.randomBytes(8).toString("hex")}.${ext}`;
            const filepath = path.resolve(uploadFolder, newFilename);

            await fs.promises.writeFile(filepath, buffer);

            // Mover imagen anterior a carpeta old
            if (noticia.image) {
                const oldPath = path.resolve(uploadFolder, noticia.image);
                if (fs.existsSync(oldPath)) {
                    await fs.promises.rename(oldPath, path.resolve(oldFolder, noticia.image));
                }
            }

            noticia.image = newFilename;
        }

        noticia.fechaModificacion = new Date();
        await noticia.save();

        res.status(200).json({ success: true, mensaje: "Noticia actualizada", data: noticia });
    } catch (error) {
        console.error("Error en updateNoticia:", error.message);
        res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
    }
};


// Ocultar noticia (solo admin)
export const ocultarNoticia = async (req, res) => {
    try {
        const { NoticiaId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(NoticiaId)) {
            return res.status(400).json({ success: false, mensaje: "ID de noticia inválido" });
        }

        const noticia = await Noticia.findById(NoticiaId);
        if (!noticia) return res.status(404).json({ success: false, mensaje: "Noticia no encontrada" });

        noticia.esMostrable = false;
        await noticia.save();

        res.status(200).json({ success: true, mensaje: "Noticia ocultada correctamente", data: noticia });
    } catch (error) {
        console.error("Error en ocultarNoticia:", error);
        res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
    }
};

// Checar usuario autenticado
export const checarAutenticado = (req, res) => {
    try {
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        console.error("Error en autenticación:", error);
        res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
    }
};
