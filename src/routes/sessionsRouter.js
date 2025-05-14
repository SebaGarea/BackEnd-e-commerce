import { Router } from 'express';
import passport from 'passport';
import { auth } from '../middleware/auth.js';
import { currentController, errorController, perfilController, loginController, logoutController, registroController } from '../controllers/sessions.controller.js';


export const router=Router()

router.post('/registro', passport.authenticate("registro", {session: false, failureRedirect: '/api/sessions/error'}),registroController)
router.post('/login', passport.authenticate('login', { session: false, failureRedirect: '/api/sessions/error' }),loginController)
router.get('/logout', logoutController );
router.get('/current', passport.authenticate('current', { session: false }), currentController);
router.get("/error", errorController)
router.get("/perfil", auth, perfilController)



