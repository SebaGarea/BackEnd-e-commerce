import {Router} from 'express';
import ViewsController from '../controllers/views.controller.js';

export const router = Router();

router.get('/productos', ViewsController.renderProductos)

router.get('/productos/nuevo', ViewsController.renderNewProducto)

router.get('/producto/:code', ViewsController.renderProductoByCod)

router.get('/producto/editar/:code', ViewsController.renderProductoEdit)

router.get('/cart/:cid', ViewsController.renderCartCid)



// // Ruta para ver el carrito
// router.get('/cart/:cid', async (req, res) => {
//     try {
        
            
      
        
//         res.render('cart', { cart });
//     } catch (error) {
//         res.render('error', { error: 'Error al obtener el carrito' });
//     }
// });


