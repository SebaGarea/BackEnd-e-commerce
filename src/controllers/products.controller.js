
import { ProductoDTO } from "../dtos/productos.dto.js";
import { productosService } from "../services/productos.service.js";


export default class ProductosController{

    static async getProductos(req,res){
        try {
            const productos = await productosService.getProductos();
            const productosDTO = ProductoDTO.fromArray(productos);
            

            res.setHeader('Content-Type','application/json');
            return res.status(200).json({status:"succes", productos:productosDTO});
        
          } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({
              status: "error",
              error: "Error al obtener los productos"
            });
          }
    }
}