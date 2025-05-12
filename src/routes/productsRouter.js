import { Router } from "express";
import {uploader} from "../utilsMulter.js";
import ProductosController from "../controllers/products.controller.js";

export const router = Router();


router.get("/", ProductosController.getProductos);
router.get("/:cod", ProductosController.getProductosById);
router.post("/", uploader.single("file"), ProductosController.postProductos);
router.delete("/:pid", ProductosController.deleteProducto)
router.put('/:pid', uploader.single('file'), ProductosController.updateProducto);











