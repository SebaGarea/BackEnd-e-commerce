import {ProductoModel} from "./models/product.model.js"

export class ProductosDAOMongo{

    static async create(producto){
        try {
            let nuevoProducto = await ProductoModel.create(producto);
            return nuevoProducto.toObject();
        } catch (error) {
            throw new Error(`Error al crear producto en DB: ${error.message}`);
        }
    }

    static async getAll(){
        try {
            return await ProductoModel.find().lean();
        } catch (error) {
            throw new Error(`Error al obtener productos de DB: ${error.message}`);
        }
    }

    static async getById(cod){
        try {
            const producto = await ProductoModel.findOne({ cod }).lean();
            if (!producto) {
                throw new Error(`Producto con código ${cod} no encontrado`);
            }
            return producto;
        } catch (error) {
            throw new Error(`Error al obtener producto por ID: ${error.message}`);
        }
    }
}