import jwt from "jsonwebtoken";
export const generartoken = (user, res)=>{
    const token = jwt.sign({userId: user._id, esAdmin: user.esAdmin, username: user.username }, process.env.JWT_SECRET,{
        expiresIn: "1h"
    });
    res.cookie("jwt", token, {
        maxAge: 60*60, // Habilitado para una hora
        httpOnly: true, //Prevencion ataques XSS
        sameSite: "strict", // Prevencion ataques CSRF
        secure: process.env.NODE_ENV !== "development" // Solo sera seguro hasta que sea produccion

    })
    return token;
}
