import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import {UsuarioDTO} from "../dtos/usuarios.dto.js"

export const loginServicie = (req, res) => {
  let usuario = req.user;
  delete usuario.password;
  let token = jwt.sign(usuario, config.SECRET, { expiresIn: 60 * 10 });
  res.cookie("cookieToken", token, {
    maxAge: 60 * 10 * 1000,
    httpOnly: true,
    signed: true,
  });

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({
    message: "Login exitoso",
    usuarioLogueado: usuario,
  });
};


export const logoutService= (req, res) => { 
    
    res.clearCookie('cookieToken');
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        message: "Logout exitoso"
    });
}

export const currentService = (req,res) =>{
    const usuarioDTO = new UsuarioDTO(req.user);
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message: 'Usuario autenticado mediante JWT',
        usuario: usuarioDTO,
    });
}

export const perfilService = (req, res) =>{
     res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:req.user});
}