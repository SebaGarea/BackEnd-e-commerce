import { Router } from "express";
import cartModel from '../models/cart.model.js';
import ProductoModel from '../models/product.model.js';
const router = Router();

// Metodo POST Raiz
router.post("/", async (req, res) => {
  try {
    const newCart = new cartModel({ productos: [] });
    await newCart.save();

    res.status(201).json({
      status: "success",
      message: "Carrito creado",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el carrito",
    });
  }
});

// Metodo GET raiz
router.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find().populate('productos.producto');
        res.json({
            status: 'success',
            carts
        });
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener los carritos'
        });
    }
});

// Metodo GET id
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid).populate('productos.producto');
        
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            cart
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener el carrito'
        });
    }
});

// Metodo POST id
router.post("/:cid/producto/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productoId = req.params.pid;

        // Verificar si el carrito existe
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                message: "Carrito no encontrado"
            });
        }

        // Verificar si el producto existe
        const producto = await ProductoModel.findById(productoId);
        if (!producto) {
            return res.status(404).json({
                status: "error",
                message: "Producto no encontrado"
            });
        }

        // Buscar si el producto ya existe en el carrito
        const productoIndex = cart.productos.findIndex(
            (item) => item.producto.toString() === productoId
        );

        if (productoIndex === -1) {
            // Si el producto no existe en el carrito, lo agregamos
            cart.productos.push({
                producto: productoId,
                quantity: 1
            });
        } else {
            // Si el producto existe, incrementamos la cantidad
            cart.productos[productoIndex].quantity++;
        }

        // Guardamos los cambios
        await cart.save();

        // Utilizamos populate para obtener los datos completos del producto
        const updatedCart = await cart.populate('productos.producto');

        // Renderizamos la vista cart.handlebars con los datos del carrito
        res.render('cart', { 
            cart: updatedCart.toObject(),
            status: "success",
            message: "Producto agregado al carrito"
        });

    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({
            status: "error",
            message: "Error al agregar producto al carrito",
            error: error.message
        });
    }
});

export default router;
