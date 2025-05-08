import { Router } from "express";
import {uploader} from "../utilsMulter.js";
import {ProductoModel} from "../dao/models/product.model.js";
import ProductosController from "../controllers/products.controller.js";

export const router = Router();


router.get("/", ProductosController.getProductos);
router.get("/:cod", ProductosController.getProductosById);
router.post("/", uploader.single("file"), ProductosController.postProductos);







// Metodo PUT
router.put('/:pid', uploader.single('file'), async (req, res) => {
    try {
        const productoId = req.params.pid;
        const updateFields = {
            ...req.body,
            status: req.body.status === 'true',
            stock: parseInt(req.body.stock),
            precio: parseFloat(req.body.precio)
        };

        if (req.file) {
            updateFields.thumbnail = req.file.filename;
        }

        const updatedProducto = await ProductoModel.findByIdAndUpdate(
            productoId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedProducto) {
            return res.render('error', { error: 'Producto no encontrado' });
        }

        res.redirect('/productos');

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.render('error', { error: 'Error al actualizar el producto: ' + error.message });
    }
});



// Metodo DELETE :pid
router.delete("/:pid", async (req, res) => {
    try {
        const productoId = req.params.pid;

        // Buscamos y eliminamos el producto
        const deletedProducto = await ProductoModel.findByIdAndDelete(productoId);

        // Verificamos si el producto existía
        if (!deletedProducto) {
            return res.status(404).json({
                status: "error",
                message: "Producto no encontrado"
            });
        }

        // Respondemos con éxito
        res.json({
            status: "success",
            message: "Producto eliminado exitosamente",
            deletedProducto
        });

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({
            status: "error",
            message: "Error al eliminar el producto",
            error: error.message
        });
    }
});


