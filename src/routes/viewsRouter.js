import {Router} from 'express';
import {ProductoModel} from '../dao/models/product.model.js';
import cartModel from '../dao/models/cart.model.js';

export const router = Router();

// Ruta para mostrar el formulario de nuevo producto
router.get('/productos/nuevo', async (req,res)=>{
    res.render('newProducto')
})


//Ruta para mostrar todos los productos
router.get('/productos', async (req, res) => {
    try {
        // Obtener parámetros de query
        const { page = 1, limit = 4 } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };

        // Realizar consulta paginada
        const infoPaginate = await ProductoModel.paginate({}, options);
        
        // Buscar un carrito existente o crear uno nuevo
        let cart = await cartModel.findOne();
        if (!cart) {
            cart = await cartModel.create({ productos: [] });
        }

        
        const baseUrl = '/productos';
        const prevLink = infoPaginate.hasPrevPage ? `${baseUrl}?page=${infoPaginate.prevPage}` : null;
        const nextLink = infoPaginate.hasNextPage ? `${baseUrl}?page=${infoPaginate.nextPage}` : null;

        
        res.render('productos', {
            productos: infoPaginate.docs,
            cartId: cart._id.toString(),
            hasPrevPage: infoPaginate.hasPrevPage,
            hasNextPage: infoPaginate.hasNextPage,
            prevPage: infoPaginate.prevPage,
            nextPage: infoPaginate.nextPage,
            currentPage: infoPaginate.page,
            totalPages: infoPaginate.totalPages,
            prevLink,
            nextLink
        });

    } catch (error) {
        console.error('Error:', error);
        res.render('error', { error: 'Error al cargar los productos' });
    }
});


//Ruta para mostrar un producto por su :cod
router.get('/producto/:cod', async (req, res)=>{
    try{
        const producto = await ProductoModel.findOne({cod: req.params.cod}).lean();
        
        let cart = await cartModel.findOne();
        if (!cart) {
            cart = await cartModel.create({ productos: [] });
        }

        res.render('producto', {
            producto,
            cartId: cart._id.toString()
        });
    
    }catch(error){
        console.error('Error:', error);
        res.render('error', { error: 'Error al cargar el producto' });

    }
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
        const cart = await cartModel.findById(req.params.cid)
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


