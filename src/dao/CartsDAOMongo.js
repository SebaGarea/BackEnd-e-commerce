import cartModel from "./models/cart.model.js";
import { ProductoModel } from "./models/product.model.js";

export class CartsDAOMongo {
  async createCart() {
    try {
      const newCart = new cartModel({ productos: [] });
      return await newCart.save();
    } catch (error) {
      throw new Error(`Error al crear el carrito en DB: ${error.message}`);
    }
  }

  async getCarts() {
    try {
      const carts = await cartModel
        .find()
        .populate("productos.producto")
        .lean();
      return carts;
    } catch (error) {
      throw new Error(`Error al obtener los carritos en DB: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel
        .findById(cartId)
        .populate("productos.producto")
        .lean();
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito en DB: ${error.message}`);
    }
  }

  async addProductoToCart(cid, pid) {
    try {
      const cart = await cartModel.findById(cid);
      if (!cart) {
        return {
          status: "error",
          code: 404,
          message: "Carrito no encontrado en DB",
        };
      }

      const producto = await ProductoModel.findOne({ cod:pid }).lean();
      if (!producto) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado en DB",
        });
      }

      const productoId = producto._id.toString();

      const productoIndex = cart.productos.findIndex(
        (item) => item.producto.toString() === productoId
      );

      if (productoIndex === -1) {
        cart.productos.push({
          producto: productoId,
          quantity: 1,
        });
      } else {
        cart.productos[productoIndex].quantity++;
      }
      await cart.save();
      return await cart.populate("productos.producto");
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
  }

  async deleteProductFromCart(cartId, productoId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) return null;

      cart.productos = cart.productos.filter(
        (item) => item.producto.toString() !== productoId
      );

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al eliminar producto del carrito: ${error.message}`
      );
    }
  }
}
