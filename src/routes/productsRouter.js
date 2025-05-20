import { Router } from "express";
import { uploader } from "../utilsMulter.js";
import ProductosController from "../controllers/products.controller.js";
import passport from "passport";
import { autorizeAdmin } from "../middleware/auth.js";

export const router = Router();

router.get("/", ProductosController.getProductos);
router.get("/:cod", ProductosController.getProductosById);

router.post(
  "/",
  passport.authenticate("current", { session: false }),
  autorizeAdmin,
  uploader.single("file"),
  ProductosController.postProductos
);

router.delete(
  "/:pid",
  passport.authenticate("current", { session: false }),
  autorizeAdmin,
  ProductosController.deleteProducto
);

router.put(
  "/:pid",
  passport.authenticate("current", { session: false }),
  autorizeAdmin,
  uploader.single("file"),
  ProductosController.updateProducto
);
