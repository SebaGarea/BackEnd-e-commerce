import { CartsDAOMongo as CartsDAO } from "../dao/CartsDAOMongo.js"


const cartsDAO = new CartsDAO();

export const createService = async() =>{
    const nuevoCart= await cartsDAO.createCart();
    return nuevoCart;
}


export const getAllService = async () =>{
    const getAllCarts = await cartsDAO.getCarts()
    return getAllCarts;
}


export const getCartByIdService = async (cartId) =>{
    const getCartById = await cartsDAO.getCartById(cartId);
    return getCartById;
}


export const addProductoToCartService = async(cid, pid) =>{
    const addProductoToCart= await cartsDAO.addProductoToCart(cid,pid);
    return addProductoToCart;
}

export const deleteProductFromCartService = async (cartId, productoId)=>{
    const deleteProductFromCart = await cartsDAO.deleteProductFromCart(cartId, productoId);
    return deleteProductFromCart;
}