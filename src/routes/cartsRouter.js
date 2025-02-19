import { Router } from 'express';
import { readCarts, writeCarts } from '../utils/fileUtils.js';

const router = Router();

// Metodo POST Raiz
router.post('/', async (req, res) => {
    const carts = await readCarts(); // Leemos los carritos del archivo

    // Generamos id unicos
    const maxId = carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) : 0;
    const newId = maxId + 1;

    // Creamos el nuevo carrito
    const newCart = {
        id: newId,
        products: [],
    };

    // Agregamos el carrito al array
    carts.push(newCart);
    await writeCarts(carts); // Escribimos los carritos actualizados en el archivo

    res.status(201).json({
        status: 'success',
        message: 'Carrito creado',
        cart: newCart,
    });
});

// Metodo GET raiz
router.get('/', async (req, res) => {
    const carts = await readCarts(); // Leemos los carritos del archivo
    res.json({ carts });
});

// Metodo GET id
router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const carts = await readCarts(); // Leemos los carritos del archivo
    const cart = carts.find(cart => cart.id == cartId);

    if (!cart) {
        return res.status(404).json({
            status: 'error',
            message: 'Carrito no encontrado',
        });
    }

    res.json({
        status: 'success',
        cartId: cart.id,
        products: cart.products,
        totalProducts: cart.products.length,
    });
});

// Metodo POST id
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const carts = await readCarts(); // Leemos los carritos del archivo

    const cartIndex = carts.findIndex(cart => cart.id == cartId);
    if (cartIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'Carrito no encontrado',
        });
    }

    // Busco si el producto ya existe en el carrito
    const productIndex = carts[cartIndex].products.findIndex(p => p.product == productId);

    if (productIndex === -1) {
        // Si el producto no existe en el carrito, lo agrego
        carts[cartIndex].products.push({
            product: productId,
            quantity: 1,
        });
    } else {
        // Si el producto existe, se incrementa la cantidad
        carts[cartIndex].products[productIndex].quantity++;
    }

    await writeCarts(carts); // Escribimos los carritos actualizados en el archivo

    res.json({
        status: 'success',
        message: 'Producto agregado al carrito',
        cart: carts[cartIndex],
    });
});

export default router;
