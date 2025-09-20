import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generartoken } from "../lib/utils.js";
import { validateEmail, validateContra, validateUser } from "../services/validation.service.js";
import { ErrorApp } from "../utils/ErrorApp.js";

export const register = async (req, res) => {
    try {
        const { username, email, password, sexo } = req.body;

        // Validación básica
        if (!username || !email || !password) {
            throw new ErrorApp("Favor de llenar todos los campos", 400);
        }
        validateUser(username);
        validateEmail(email);
        validateContra(password);

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new ErrorApp("El correo o usuario ya se encuentran", 400);
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        // Crear usuario
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            sexo,
            fechaCreacion: new Date(),
            fechaUltimoAcceso: new Date(),
            esAdmin: false
        });

        await newUser.save();
        generartoken(newUser, res);
        res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (error) {
        if(error instanceof ErrorApp){
            console.log("Error: " + error);
            res.status(error.status).json({mensaje: error.mensaje})
        }else{
        console.error("Error en registro:", error.message);
        res.status(500).json({mensaje: "Error en el servidor"});
        }
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ErrorApp("Favor de llenar todos los campos", 400);
        }

        validateEmail(email);
        // No hay necesidad de limpiar la password de mongo lo hace por si

        const user = await User.findOne({ email });
        if (!user) {
            throw new ErrorApp("Credenciales incorrectas", 401);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ErrorApp("Credenciales incorrectas", 401);
        }

        generartoken(user, res);
        res.status(200).json({ mensaje: `Bienvenido ${user.username}`});
    } catch (error) {
        if(error instanceof ErrorApp){
            console.log("Error: " + error);
            res.status(error.status).json({mensaje: error.mensaje})
        }else{
        console.error("Error en registro:", error.message);
        res.status(500).json({ mensaje: "Error en el servidor" });
        }
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
    if(error instanceof ErrorApp){
        console.log("Error: " + error);
        res.status(error.status).json({mensaje: error.mensaje})
    }else{
    console.error("Error en registro:", error.message);
    res.status(500).json({ mensaje: "Error en el servidor" });
    }
  }
};


export const logout = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });
        res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
    } catch (error) {
        console.error("Error en logout:", error.message);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};
