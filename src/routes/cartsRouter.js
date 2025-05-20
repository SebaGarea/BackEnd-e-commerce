import { Router } from "express";
import passport from 'passport';
import { addProductController,  createController,  deleteProductFromCartController,  getCartIdController,  getController,} from "../controllers/carts.controller.js";
import { autorizeUser } from "../middleware/auth.js";

export const router = Router();

router.post("/", createController);
router.get("/", getController);
router.get("/:cid", getCartIdController);

router.post(
  "/:cid/producto/:pid",
  passport.authenticate("current", { session: false }),
  autorizeUser,
  addProductController
);
router.delete(
  "/:cid/producto/:pid",
  passport.authenticate("current", { session: false }),
  autorizeUser,
  deleteProductFromCartController
);
