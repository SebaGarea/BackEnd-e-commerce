import {ProductoModel} from "./models/product.model.js"

export class ProductosDAOMongo{

    static create(producto){
        let nuevoProducto = ProductoModel.create(producto);
        return nuevoProducto.toJSON();
    }

    static getAll(){
        return ProductoModel.find().lean();
    }

    static getById(cod){
        return  ProductoModel.findOne({ cod }).lean();
    }






}