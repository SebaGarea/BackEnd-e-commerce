import { cartsService } from "../services/carts.service.js";
import { viewsService } from "../services/views.service.js";

export default class ViewsController {
  static async renderProductos(req, res) {
    try {
      const { page = 1, limit = 4 } = req.query;
      const infoPaginate = await viewsService.getPaginatedProducts(page, limit);
      const cart = await cartsService.getOrCreateCart();

      const baseUrl = "/productos";
      const prevLink = infoPaginate.hasPrevPage
        ? `${baseUrl}?page=${infoPaginate.prevPage}`
        : null;
      const nextLink = infoPaginate.hasNextPage
        ? `${baseUrl}?page=${infoPaginate.nextPage}`
        : null;

      res.render("productos", {
        productos: infoPaginate.docs,
        cartId: cart._id.toString(),
        hasPrevPage: infoPaginate.hasPrevPage,
        hasNextPage: infoPaginate.hasNextPage,
        prevPage: infoPaginate.prevPage,
        nextPage: infoPaginate.nextPage,
        currentPage: infoPaginate.page,
        totalPages: infoPaginate.totalPages,
        prevLink,
        nextLink,
      });
    } catch (error) {
      res.render("error", {
        error: "Error al cargar los productos en controller",
      });
    }
  }

  static async renderNewProducto(req, res) {
    try {
      return res.render("newProducto");
    } catch (error) {
    
      res.render("error", {
        error: "Error al cargar los productos en controller",í
        
      });
    }
  }

  static async renderProductoByCod(req, res) {
    try {

      const {cod} = req.params;

      const producto = await viewsService.getProductByCod(cod);

      let cart = await cartsService.getOrCreateCart();

      res.render("producto", {
        producto,
        cartId: cart._id.toString(),
      });
    } catch (error) {
      res.render("error", {
        error: `Error al mostrar el producto con el cod ${req.params.cod}`,
      });
    }
  }

  static async renderProductoEdit(req, res){
    try {
        const {cod} = req.params;
        const producto = await viewsService.getProductByCod(cod)

        res.render('editProducto', { producto });

    } catch (error) {
      res.render("error", {
        error: `Error al mostrar el edit del producto con el cod ${req.params.cod}`,
      });
    }
  }

  static async renderCartCid(req, res){
    try {
      const cartId = req.params.cid

      const cart = await cartsService.getCartByIdService(cartId);

      if (!cart) {
            return res.render('error', { error: 'Carrito no encontrado' });
        }

    res.render('cart', { cart });

    } catch (error) {
      res.render("error", {
        error: `Error al mostrar el carrito con el cid:  ${req.params.cid}`,
      });
    }
  }

}
