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
      const { id } = req.params;

      const producto = await productosService.getProductosById(id);

      if (!producto) {
        return res.render("error", { error: "Producto no encontrado" });
      }

      const productoDTO = ProductoDTO.fromObject(producto);

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          status: "success",
          message: "Producto encontrado",
          producto: productoDTO,
        });
      }

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
    let productData;

    // Si los datos vienen en JSON (sin archivo)
    if (!req.file) {
      productData = req.body;
    } else {
      // Si los datos vienen como form-data con un archivo
      productData = {
        ...req.body,
        thumbnail: req.file.filename, // Guardar el nombre del archivo subido
      };
    }

    // Validar que todos los campos requeridos estén presentes
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

    // Crear el producto en la base de datos
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
  // static async postProductos(req, res) {
  //   try {
  //     const productData = new ProductoDTO({
  //       ...req.body,
  //       thumbnail: req.file ? req.file.filename : undefined,
  //     });

  //     productData.validate();

  //     const newProduct = await productosService.createProducto(productData);

     
  //       // return res.json({
  //       //   status: "success",
  //       //   message: "Producto creado",
  //       //   producto: newProduct,
  //       // });
      
  //     res.redirect("/productos");

  //   } catch (error) {
  //     console.error(error)
  //     console.error("Error al crear producto:", error);
  //     res.render("error", {
  //       error: "Error al crear el producto: " + error.message,
  //     });
  //   }
  // }



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

      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.json({
          status: "success",
          message: "Producto actualizado exitosamente",
          producto: productoDTO,
        });
      }

      return res.redirect("/productos");
    } catch (error) {
      if (
        req.headers.accept &&
        req.headers.accept.includes("application/json")
      ) {
        return res.status(500).json({
          status: "error",
          error: "Error al Actualizar el producto en controller",
        });
      }
      return res.render("error", { error: "Error al actulizar el producto" });
    }
  }
}
