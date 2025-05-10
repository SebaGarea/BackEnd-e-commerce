import { ProductosDAOMongo as ProductosDAO } from "../dao/ProductosDAOMongo.js";

class ProductosService {
  constructor(dao) {
    this.productosDAO = dao;
  }

  async getProductos() {
    return await this.productosDAO.getAll();
  }

  async getProductosById(cod) {
    return await this.productosDAO.getById(cod);
  }

  async createProducto(productData) {
    try {
      return await this.productosDAO.create(productData);
    } catch (error) {
      throw new Error(`Error en servicio al crear producto: ${error.message}`);
    }
  }

  async deleteProducto(productoId) {
    try {
      const deletedProducto = await this.productosDAO.deleteProducto(productoId);

      if (!deletedProducto) {
        throw new Error(`Producto con ID ${productoId} no encontrado`);
    }
    return deletedProducto;

    } catch (error) {
      throw new Error(
        `Error al eliminar el producto en service${error.message}`
      );
    }
  }
}

export const productosService = new ProductosService(ProductosDAO);
