import { Router } from "express";

import { addProductController, createController, deleteProductFromCartController, getCartIdController, getController } from "../controllers/carts.controller.js";

export const router = Router();


router.post("/", createController);
router.get('/', getController);
router.get('/:cid', getCartIdController);
router.post("/:cid/producto/:pid", addProductController);
router.delete('/:cid/producto/:pid', deleteProductFromCartController);

