import { ProductosDAOMongo as ProductosDAO } from "../dao/ProductosDAOMongo.js";



class ProductosService{
    constructor(dao){
        this.productosDAO = dao;
    }

    async getProductos(){
        return await this.productosDAO.getAll();
    }


}




export const productosService = new ProductosService(ProductosDAO)