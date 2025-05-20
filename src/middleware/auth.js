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


export const autorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'No autorizado - Solo administradores' });
    }
    
    next();
};

export const autorizeUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (req.user.role !== 'user') {
        return res.status(403).json({ error: 'No autorizado - Solo usuarios' });
    }
    
    next();
};