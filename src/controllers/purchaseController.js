import { ticketsService } from "../services/tickets.service.js";
import { productosService } from "../services/productos.service.js";
import { cartsService } from "../services/carts.service.js";

export const purchaseController = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsService.getCartByIdService(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: `Carrito con ID ${cid} no encontrado`,
      });
    }

    const productsNotPurchased = [];
    let totalAmount = 0;

    for (const item of cart.productos) {
      const product = await productosService.getProductosById(
        item.producto._id
      );

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productosService.updateProducto(product._id, {
          stock: product.stock,
        });

        totalAmount += product.price * item.quantity;
      } else {
        productsNotPurchased.push(item.producto._id);
      }
    }

    if (totalAmount > 0) {
      const ticketData = {
        code: `TICKET-${Date.now()}`,
        amount: totalAmount,
        purchaser: req.user.email,
      };
      await ticketsService.createTicket(ticketData);
    }

    cart.productos = cart.productos.filter((item) =>
      productsNotPurchased.includes(item.producto._id)
    );
    await cartsService.updateCartService(cid, cart.productos);

    res.status(200).json({
      status: "success",
      message: "Compra procesada",
      productsNotPurchased,
    });
  } catch (error) {
    console.error("Error al procesar la compra:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno al procesar la compra",
    });
  }
};
