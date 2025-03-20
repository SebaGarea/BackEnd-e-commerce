import {Router} from 'express';
import ProductoModel from '../models/product.model.js';

const router = Router();

// Ruta para mostrar el formulario de nuevo producto
router.get('/productos/nuevo', async (req,res)=>{
    res.render('newProducto')
})


//Ruta para mostrar todos los productos
router.get('/productos', async (req, res)=>{
    const productos = await ProductoModel.find().lean();
    res.render('productos', {productos});
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
    } catch (error) {
        res.render('error', { error: 'Error al obtener el producto' });
    }
});

export default router;