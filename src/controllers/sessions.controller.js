import { currentService, loginServicie, logoutService, perfilService } from "../services/sessions.service.js";


export const registroController = (req, res)=>{

    res.setHeader('Content-Type','application/json');
    return res.status(201).json({
        message: "Registro Exitoso",
        nuevoUsuario:req.user
    });
}

export const loginController = (req, res)=>{
    return loginServicie(req,res);
}

export const logoutController = (req,res)=>{
    return logoutService(req,res);
}

export const currentController = (req,res)=>{
    return currentService(req, res);
}

export const errorController = (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401)
    .json({error: `Error en la operación: Registro fallido. Verifica los datos enviados.`})
}


export const perfilController =(req, res) =>{
    return perfilService  (req,res) 
}