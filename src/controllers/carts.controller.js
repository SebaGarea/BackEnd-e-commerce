import { cartsService } from "../services/carts.service.js";

export const createController = async (req, res) => {
  try {
    const nuevoCart = await cartsService.createService();

    res.status(201).json({
      status: "success",
      message: "Carrito creado",
      cart: nuevoCart,
    });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito",
    });
  }
};

export const getController = async (req, res) => {
  try {
    const getCarts = await cartsService.getAllService();
    res.status(201).json({
      status: "success",
      message: "Carritos Obtenidos",
      cart: getCarts,
    });
  } catch (error) {
    console.error("Error al obtener carritos:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener los carritos en controller",
    });
  }
};

export const getCartIdController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartsService.getCartByIdService(cartId);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: `Carrito con id ${cartId} no encontrado`,
      });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "succes",
      cart,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({
      status: "error",
      message: "Error al obtener el carrito en el controller",
    });
  }
};

export const addProductController = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartsService.addProductoToCartService(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito o producto no encontrado",
      });
    }

      return res.json({
        status: "Producto agregado al carrito",
        cart: updatedCart,
      });
    
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);

      return res.status(500).json({
        status: "error",
        message:
          "Error al agregar producto en el carrito, en el controller de carts",
      });
  
  
  }
};

export const deleteProductFromCartController = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartsService.deleteProductFromCartService(cid, pid);

    if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "Carrito o Producto no encontrado",
        });
      }
    
      return res.json({
        status: "success",
        message: "Producto eliminado del carrito",
        cart,
      });

  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);

      return res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    
  }
};

export const updateCartController = async (req, res) => {
  try {
    const { cid } = req.params; 
    const { products } = req.body; 

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        message: "El cuerpo de la solicitud debe contener un array de productos",
      });
    }

    const updatedCart = await cartsService.updateCartService(cid, products);

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: `Carrito con ID ${cid} no encontrado`,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Carrito actualizado exitosamente",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno al actualizar el carrito",
    });
  }
};
