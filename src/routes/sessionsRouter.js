import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { auth } from '../middleware/auth.js';


export const router=Router()

router.post('/registro', passport.authenticate("registro", {session: false, failureRedirect: '/api/sessions/error'}), (req,res)=>{

    
    res.setHeader('Content-Type','application/json')
    res.status(201).json({message:"Registro exitoso!!!", nuevoUsuario: req.user})
})


router.post('/login', passport.authenticate('login', { session: false, failureRedirect: '/api/sessions/error' }), (req, res) => {
  
    let usuario = req.user;
    delete usuario.password;
    let token = jwt.sign(usuario, config.SECRET, { expiresIn: 60*10 });

    res.cookie('cookieToken', token, { 
        maxAge: 60*10*1000, 
        httpOnly: true,
        signed: true, 

    });

    res.setHeader('Content-Type','application/json');
    return res.status(200).json({
        message: "Login exitoso",
        usuarioLogueado: usuario
    });
});

router.get('/logout', (req, res) => { 
    
    res.clearCookie('cookieToken');
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        message: "Logout exitoso"
    });
});



router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(401).json({error:`Error en la operación`})
})


router.get("/perfil", auth, (req, res)=>{


    res.setHeader('Content-Type','application/json');
    return res.status(200).json({payload:req.user});
})


router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message: 'Usuario autenticado mediante JWT',
        usuario: req.user
    });
});

