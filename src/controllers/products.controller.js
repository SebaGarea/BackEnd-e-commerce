import { ProductoDTO } from "../dtos/productos.dto.js";
import { productosService } from "../services/productos.service.js";


export default class ProductosController {
  static async getProductos(req, res) {
    try {
      const productos = await productosService.getProductos();
      const productosDTO = ProductoDTO.fromArray(productos);

      return res.render("productos", {productos: productosDTO});
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({
        status: "error",
        error: "Error al obtener los productos",
      });
    }
  }

  static async getProductosById(req, res) {
    try {
    const { cod } =req.params;

      const producto = await productosService.getProductosById(cod);
     
      if (!producto) {
       return res.render("error", { error: "Producto no encontrado" });
      }
        
      const productoDTO = ProductoDTO.fromObject(producto)

     return res.render("producto", {producto: productoDTO});


    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({
          status: "error",
          error: "Error al obtener el producto" });
    }
  }


static async postProductos(req, res){
  try {
     
    const productData = new ProductoDTO({
      ...req.body,
      thumbnail: req.file ? req.file.filename : undefined
  });
   
    productData.validate();

    const newProduct = await productosService.createProducto(productData);



      res.redirect('/productos');
  } catch (error) {
      console.error('Error al crear producto:', error);
      res.render("error", { 
          error: "Error al crear el producto: " + error.message 
      });
  }
}



}
