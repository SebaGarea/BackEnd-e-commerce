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

cartSchema.pre('find', function() {
  this.populate('productos.producto');
});

cartSchema.pre('findOne', function() {
  this.populate('productos.producto');
});

cartSchema.pre('findById', function() {
  this.populate('productos.producto');
});


const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
