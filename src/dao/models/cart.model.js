import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productos: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productos",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
