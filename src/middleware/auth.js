import jwt from "jsonwebtoken"
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    try {
        const token = req.signedCookies['cookieToken']; // Usamos signedCookies si la cookie está firmada
        
        if (!token) {
            return res.status(401).json({ error: 'No hay usuario autenticado' });
        }

        const usuario = jwt.verify(token, config.SECRET);
        req.user = usuario;
        next();
    } catch (error) {
        return res.status(401).json({ error: `Error de autenticación: ${error.message}` });
    }
};