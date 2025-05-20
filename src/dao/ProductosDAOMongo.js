import { ProductoModel } from "./models/product.model.js";

export class ProductosDAOMongo {
  static async create(producto) {
    try {
      let nuevoProducto = await ProductoModel.create(producto);
      return nuevoProducto.toObject();
    } catch (error) {
      console.error(error)
      throw new Error(`Error al crear producto en DB: ${error.message}`);
    }
  }

  static async getAll() {
    try {
      return await ProductoModel.find().lean();
    } catch (error) {
      throw new Error(`Error al obtener productos de DB: ${error.message}`);
    }
  }

  static async getByCod(cod) {
    try {
      const producto = await ProductoModel.findOne({ cod }).lean();
      if (!producto) {
        throw new Error(`Producto con código ${cod} no encontrado`);
      }
      return producto;
    } catch (error) {
      throw new Error(`Error al obtener producto por ID: ${error.message} en DB`);
    }
  }

  static async deleteProducto(cod) {
    try {
      const deleteProducto = await ProductoModel.findOneAndDelete({ cod });

      return deleteProducto;
    } catch (error) {
      throw new Error(`Error al eliminar el producto en DB: ${error.message}`);
    }
  }

  static async update(productoId, updateFields) {
    try {
      const updateProducto = await ProductoModel.findOneAndUpdate(
        { cod: productoId },
        updateFields,
        { new: true, runValidators: true }
      );

      return updateProducto;
    } catch (error) {
      throw new Error(`Error al editar el producto en DB: ${error.message}`);
    }
  }

  static async getPaginated(page = 1, limit = 4) {
    try {
      const options = { page, limit, lean: true };
      return await ProductoModel.paginate({}, options);
    } catch (error) {
      throw new Error(`Error al obtener productos paginados: ${error.message}`);
    }
  }

  static async getPaginatedProducts(options) {
    return await ProductoModel.paginate({}, options);
  }

  static async findById(id) {
    return await ProductoModel.findById(id).lean();
  }
  
}
