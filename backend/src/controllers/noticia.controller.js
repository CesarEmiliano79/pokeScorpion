import Noticia from "../models/noticia.model.js";
import mongoose from "mongoose";
import { salvarImagenBase64, moverImagenVieja } from "../services/file.service.js";
import { validateText, desencriptaCaracteresRaros } from "../services/validation.service.js";

// GET[:id]
export const noticia = async (req, res) => {
  try {
    const { NoticiaId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(NoticiaId)) {
      return res.status(400).json({ success: false, mensaje: "ID de noticia inválido" });
    }

    let noticia = await Noticia.findById(NoticiaId).populate("autor", "username email").lean(); // Hacemos referencias a otros documentos para traer el nombre y email. Posterior aplicamos una mascara de texto plano(no documentos)
    if (!noticia || !noticia.esMostrable) {
      return res.status(404).json({ success: false, mensaje: "Noticia no encontrada" });
    }
    noticia.title = desencriptaCaracteresRaros(noticia.title);
    noticia.descripcion = desencriptaCaracteresRaros(noticia.descripcion);

    console.log({
      original: noticia.title,
      decoded: desencriptaCaracteresRaros(noticia.title)
    });


    res.status(200).json({ success: true, data: noticia });
  } catch (error) {
    console.error("Error en noticia:", error.message);
    res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
  }
};

// GET(con paginacion)
export const noticias = async (req, res) => {
  try {
    let { page = 1, limit = 9 } = req.query;
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

    let allNoticias = await Noticia.find({ esMostrable: true })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ fechaCreacion: -1 })
      .populate("autor", "username");

    // Desencriptar cada noticia
    allNoticias = allNoticias.map(n => ({
      ...n._doc, // Creame una copia del documento
      title: desencriptaCaracteresRaros(n.title), // sobreescribeme el titulo
      descripcion: desencriptaCaracteresRaros(n.descripcion) // Y tambien esto
    }));

    res.status(200).json({ success: true, noticias: allNoticias, total, totalPages });
  } catch (error) {
    console.error("Error en noticias:", error);
    res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
  }
};

// POST
export const addNoticia = async (req, res) => {
  try {
    const { title, imageBase64, esMostrable = true, descripcion = "" } = req.body;

    if (!title) return res.status(400).json({ success: false, mensaje: "El título es obligatorio" });
    if (!req.user || !req.user.userId)
      return res.status(401).json({ success: false, mensaje: "Usuario no autenticado" });

    
    const tituloSeguro = validateText(title);
    const DescripcionSegura = validateText(descripcion);

    // Guardar imagen (si hay)
    let filename = null;
    if (imageBase64) filename = await salvarImagenBase64(imageBase64);

    const nuevaNoticia = new Noticia({
      title: tituloSeguro,
      descripcion: DescripcionSegura,
      image: filename,
      autor: req.user.userId,
      esMostrable,
      fechaCreacion: new Date(),
      fechaModificacion: null,
    });

    await nuevaNoticia.save();

    res.status(201).json({
      success: true,
      mensaje: "Noticia creada correctamente"
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

    if (title) noticia.title = validateText(title);
    if (descripcion) noticia.descripcion = validateText(descripcion);
    if (esMostrable !== undefined) noticia.esMostrable = esMostrable;

    if (imageBase64) {
      // Guardar nueva imagen
      const newFilename = await salvarImagenBase64(imageBase64);

      // Mover imagen anterior a carpeta old
      if (noticia.image) await moverImagenVieja(noticia.image);

      noticia.image = newFilename;
    }

    noticia.fechaModificacion = new Date();
    await noticia.save();

    res.status(200).json({
      success: true,
      mensaje: "Noticia actualizada",
      data: {
        ...noticia._doc,
        title: desencriptaCaracteresRaros(noticia.title),
        descripcion: desencriptaCaracteresRaros(noticia.descripcion)
      }
    });
  } catch (error) {
    console.error("Error en updateNoticia:", error.message);
    res.status(500).json({ success: false, mensaje: "Error interno del servidor" });
  }
};

export const checarAutenticado = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ mensaje: "No autenticado", esAdmin: false });
    }

    const { userId, esAdmin } = req.user;

    res.status(200).json({
      userId,
      esAdmin,
      mensaje: "Usuario autenticado"
    });
  } catch (error) {
    console.error("Error en autenticación:", error.message);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Ni se usa. Pero por si algun dia se me antoja
export const searchNoticia = async (req, res) => {
  try {
    let { query } = req.query;

    // 1. Vacio pa fuera
    if (!query || typeof query !== "string" || query.trim() === "") {
      return res.status(400).json({ success: false, mensaje: "Debes enviar un parámetro de búsqueda" });
    }

    // 2. Solo 100, mas ya no
    query = query.trim();
    if (query.length > 100) {
      return res.status(400).json({ success: false, mensaje: "Búsqueda demasiado larga" });
    }

    // 3. Escape de caracteres raros
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeQuery = escapeRegex(query);

    // 4. Busqueda segura
    const result = await Noticia.find({
      title: { $regex: safeQuery, $options: "i" }
    }).limit(10);

    // 5. Desencriptar ya que chance y si vienen encriptados
    const cleanResult = result.map(n => ({
      ...n._doc,
      title: desencriptaCaracteresRaros(n.title),
      descripcion: desencriptaCaracteresRaros(n.descripcion)
    }));

    res.status(200).json({ success: true, total: cleanResult.length, data: cleanResult });
  } catch (error) {
    console.error("Error buscando noticias:", error);
    res.status(500).json({ success: false, mensaje: "Error buscando noticias" });
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
