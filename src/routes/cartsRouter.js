import { Router } from "express";
import passport from "passport";
import {
  addProductController,
  createController,
  deleteProductFromCartController,
  getCartIdController,
  getController,
  updateCartController,
  
} from "../controllers/carts.controller.js";
import { autorizeUser } from "../middleware/auth.js";
import { purchaseController } from "../controllers/purchaseController.js";

export const router = Router();

router.post("/", createController);
router.get("/", getController);
router.get("/:cid", getCartIdController);

router.post(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  autorizeUser,
  addProductController
);
router.delete(
  "/:cid/product/:pid",
  passport.authenticate("current", { session: false }),
  autorizeUser,
  deleteProductFromCartController
);

router.put(
  "/:cid",
  passport.authenticate("current", { session: false }),
  autorizeUser,
   updateCartController
);

router.post(
  "/:cid/purchase",
  passport.authenticate("current", { session: false }),
  autorizeUser,
  purchaseController
);