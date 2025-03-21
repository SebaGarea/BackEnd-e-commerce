import {Router} from 'express';
import ProductoModel from '../models/product.model.js';
import cartModel from '../models/cart.model.js';

const router = Router();

// Ruta para mostrar el formulario de nuevo producto
router.get('/productos/nuevo', async (req,res)=>{
    res.render('newProducto')
})


//Ruta para mostrar todos los productos
router.get('/productos', async (req, res) => {
    try {
        const productos = await ProductoModel.find().lean();
        
        // Buscar un carrito existente o crear uno nuevo
        let cart = await cartModel.findOne();
        if (!cart) {
            cart = await cartModel.create({ productos: [] });
        }

        // Pasar los productosy ID del carrito a la vista
        res.render('productos', {
            productos,
            cartId: cart._id.toString() 
        });

    } catch (error) {
        console.error('Error:', error);
        res.render('error', { error: 'Error al cargar los productos' });
    }
});




//Ruta para mostrar un producto por su :cod
router.get('/producto/:cod', async (req, res)=>{
    const producto = await ProductoModel.findOne({cod: req.params.cod}).lean();
    res.render('producto', {producto});
})

// Ruta para mostrar el formulario de edición de producto
router.get('/productos/editar/:id', async (req, res) => {
    try {
        const producto = await ProductoModel.findById(req.params.id).lean();
        if (!producto) {
            return res.render('error', { error: 'Producto no encontrado' });
        }
        res.render('editProducto', { producto });
    } catch (error) {s
        res.render('error', { error: 'Error al obtener el producto' });
    }
});

// Ruta para ver el carrito
router.get('/cart/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid)
            .populate('productos.producto')
            .lean();
            
        if (!cart) {
            return res.render('error', { error: 'Carrito no encontrado' });
        }
        
        res.render('cart', { cart });
    } catch (error) {
        res.render('error', { error: 'Error al obtener el carrito' });
    }
});


export default router;