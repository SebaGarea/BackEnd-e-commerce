import { CartsDAOMongo as CartsDAO } from "../dao/CartsDAOMongo.js"




class CartsService{
    constructor(dao){
        this.cartsDAO = new dao();
    }

    async createService(){
        const nuevoCart= await this.cartsDAO.createCart();
        return nuevoCart;
    }

    async getAllService(){
        const getAllCarts = await this.cartsDAO.getCarts()
        return getAllCarts;
    }

    async getCartByIdService(cartId){
        const getCartById = await this.cartsDAO.getCartById(cartId);
        return getCartById;
    }


    async addProductoToCartService(cid, pid){
        const addProductoToCart= await this.cartsDAO.addProductoToCart(cid,pid);
        return addProductoToCart;
    }


    async deleteProductFromCartService(cid, pid){
        const deleteProductFromCart = await this.cartsDAO.deleteProductFromCart(cid , pid);
        return deleteProductFromCart;
    }
    
    async getOrCreateCart(){
        const cart = await this.cartsDAO.findOne();
            if (!cart) {
                return await this.cartsDAO.create({ productos: [] });
            }
        return cart;
    }


}

export const cartsService = new CartsService(CartsDAO)
