import { ProductoDTO } from "../dtos/productos.dto.js";
import { productosService } from "../services/productos.service.js";

export default class ProductosController {
  static async getProductos(req, res) {
    try {
      const productos = await productosService.getProductos();
      const productosDTO = ProductoDTO.fromArray(productos);

      return res.json({
        status: "success",
        productos: productosDTO,
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);

      return res.status(500).json({
        status: "error",
        error: "Error al obtener los productos",
      });
    }
  }

  static async getProductosById(req, res) {
    try {
      const { id } = req.params;

      const producto = await productosService.getProductosById(id);

      if (!producto) {
      return res.status(404).json({ 
        status: "error", 
        error: "Producto no encontrado" 
      });
    }

      const productoDTO = ProductoDTO.fromObject(producto);

      return res.json({
        status: "success",
        message: "Producto encontrado",
        producto: productoDTO,
      });
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
      let productData;

      if (!req.file) {
        productData = req.body;
      } else {
        productData = {
          ...req.body,
          thumbnail: req.file.filename,
        };
      }

      if (
        !productData.title ||
        !productData.code ||
        !productData.price ||
        !productData.stock ||
        !productData.description ||
        !productData.category ||
        productData.status === undefined
      ) {
        return res.status(400).json({ error: "Faltan campos requeridos" });
      }

      const newProduct = await productosService.createProducto(productData);

      res.status(201).json({
        status: "success",
        message: "Producto creado exitosamente",
        producto: newProduct,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(500).json({
        status: "error",
        message: "Error al crear el producto",
        error: error.message,
      });
    }
  }

  static async deleteProducto(req, res) {
    try {
      const productoId = req.params.pid;

      const deletedProducto = await productosService.deleteProducto(productoId);

      if (!deletedProducto) {
        return res.status(404).json({
          status: "error",
          message: `Producto con ID ${productoId} no encontrado`,
        });
      }
      const productoDTO = ProductoDTO.fromObject(deletedProducto);

      res.json({
        status: "success",
        message: "Producto eliminado exitosamente",
        producto: productoDTO,
      });
    } catch (error) {
      // Si el error es "no encontrado", responde 404 con mensaje estándar
      if (
        error.message.includes("no encontrado") ||
        error.message.includes("no existe")
      ) {
        return res.status(404).json({
          status: "error",
          error: "Producto no encontrado"
        });
      }
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
          message: `Producto con ID ${pid} no encontrado`,
        });
      }

      const productoDTO = ProductoDTO.fromObject(updatedProducto);

      return res.json({
        status: "success",
        message: "Producto actualizado exitosamente",
        producto: productoDTO,
      });
    }catch (error) {
      // Si el error es "no encontrado", responde 404 con mensaje estándar
      if (
        error.message.includes("no encontrado") ||
        error.message.includes("no existe")
      ) {
        return res.status(404).json({
          status: "error",
          error: "Producto no encontrado"
        });
      }
      res.status(500).json({
        status: "error",
        message: "Error al eliminar el producto",
        error: error.message,
      });
    }
  }
}
