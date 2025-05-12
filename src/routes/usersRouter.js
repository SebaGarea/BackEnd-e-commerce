import { Router } from "express";
import UsuariosController from "../controllers/usuarios.controller.js";
import { auth } from "../middleware/auth.js";

export const router = Router();

router.get("/", auth, UsuariosController.getUsuarios);
router.get("/:id", auth, UsuariosController.getUsuariosById);
router.put("/:id", auth, UsuariosController.updateUsuario)
router.delete("/:id", UsuariosController.deleteUsuario)
