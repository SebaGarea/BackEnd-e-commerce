import { ProductosDAOMongo as ProductosDAO } from "../dao/ProductosDAOMongo.js";


class ViewsService{
    constructor(dao){
        this.productosDAO = dao;
    }

    static async getProductos(page=1, limit=4){
        try {
            return await this.productosDAO.getPaginated(page,limit)
            
        } catch (error) {
            throw new Error('Error al obtener los productos en service');
        }
    }

     async getPaginatedProducts(page = 1, limit = 4) {
        try {
            const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };

         return await this.productosDAO.getPaginatedProducts(options);

        } catch (error) {
            
            throw new Error('Error al obtener los productos paginados en service');
        }
    }

    async getProductByCod(code) {
        return await this.productosDAO.getByCod(code);
    }

    async getProductById(id) {
        return await this.productosDAO.findById(id);
    }
    
    


}

export const viewsService = new ViewsService(ProductosDAO)