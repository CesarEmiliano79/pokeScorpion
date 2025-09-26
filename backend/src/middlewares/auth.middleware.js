import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ mensaje: "Acción no autorizada - No existen credenciales" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ mensaje: "Sesión expirada. Vuelve a iniciar sesión." });
            }
            return res.status(401).json({ mensaje: "Token inválido" });
        }

        // Buscar solo datos necesarios del usuario
        const user = await User.findById(decoded.userId).select("username email esAdmin");

        if (!user) {
            return res.status(404).json({ mensaje: "El usuario no existe" });
        }

        // Adjuntar datos limitados del usuario
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            esAdmin: user.esAdmin
        };

        next();
    } catch (error) {
        console.error("Error en protectRoute:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
};

export function esAdmin(req, res, next) {
  const token = req.cookies.jwt || req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.rol) {
      return res.status(403).json({ mensaje: "No autorizado" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
}
