import { ProductoDTO } from "../dtos/productos.dto.js";
import { productosService } from "../services/productos.service.js";

export default class ProductosController {
  static async getProductos(req, res) {
    try {
      const productos = await productosService.getProductos();
      const productosDTO = ProductoDTO.fromArray(productos);

      
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          status: "success",
          productos: productosDTO,
        });
      }

      return res.render("productos", { productos: productosDTO });
    } catch (error) {
      console.error("Error al obtener productos:", error);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          status: "error",
          error: "Error al obtener los productos",
        });
      }

      return res.render("error", { error: "Error al obtener los productos" });
    }
  }

  static async getProductosById(req, res) {
    try {
      const { cod } = req.params;

      const producto = await productosService.getProductosById(cod);

      if (!producto) {
        return res.render("error", { error: "Producto no encontrado" });
      }

      const productoDTO = ProductoDTO.fromObject(producto);

      return res.render("producto", { producto: productoDTO });
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res.status(500).json({
        status: "error",
        error: "Error al obtener el producto",
      });
    }
  }

  static async postProductos(req, res) {
    try {
      const productData = new ProductoDTO({
        ...req.body,
        thumbnail: req.file ? req.file.filename : undefined,
      });

      productData.validate();

      const newProduct = await productosService.createProducto(productData);

      res.redirect("/productos");
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.render("error", {
        error: "Error al crear el producto: " + error.message,
      });
    }
  }

  static async deleteProducto(req, res) {
    try {
      const productoId = req.params.pid;

      const deletedProducto = await productosService.deleteProducto(productoId);
      const productoDTO = ProductoDTO.fromObject(deletedProducto);

      res.json({
        status: "success",
        message: "Producto eliminado exitosamente",
        producto: productoDTO,
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el producto",
        error: error.message,
      });
    }
  }

  static async updateProducto(req, res) {
    try {
      const { pid } = req.params;

      const updateFields = {
        ...req.body,
        thumbnail: req.file ? req.file.filename : undefined,
      };

      const updatedProducto = await productosService.updateProducto(
        pid,
        updateFields
      );

      if (!updatedProducto) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      const productoDTO = ProductoDTO.fromObject(updatedProducto);

      if (req.headers.accept && req.headers.accept.includes("application/json")) {
       return res.json({
          status: "success",
          message: "Producto actualizado exitosamente",
          producto: productoDTO,
        });
      }

      return res.redirect("/productos");

    } catch (error) {
      if (req.headers.accept && req.headers.accept.includes("application/json")){
        return res.status(500).json({
          status: "error",
          error: "Error al Actualizar el producto en controller",
        });        
      }
      return res.render("error", { error: "Error al actulizar el producto" });
    }
  }
}
