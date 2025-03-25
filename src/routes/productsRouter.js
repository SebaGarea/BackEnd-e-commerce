import { Router } from "express";
import {uploader} from "../utilsMulter.js";
import ProductoModel from "../models/product.model.js";

const router = Router();

// Metodo Get Raiz
router.get("/", async (req, res) => {
  try {
    // Obtener parámetros de consulta con valores por defecto
    const { limit = 5, page = 1, sort, category } = req.query;

    // Configurar opciones de paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : undefined,
    };

    // Configurar filtros
    const queryFilter = {};
    if (category) {
      queryFilter.category = category;
    }

    // Realizar la consulta paginada
    const result = await ProductoModel.paginate(queryFilter, options);

    // Construir enlaces de navegación
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${
          sort ? `&sort=${sort}` : ""
        }${category ? `&category=${category}` : ""}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${
          sort ? `&sort=${sort}` : ""
        }${category ? `&category=${category}` : ""}`
      : null;

    
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      status: "error",
      error: "Error al obtener los productos",
    });
  }
});
// Metodo GET id
router.get("/:cod", async (req, res) => {
    try {
      const producto = await ProductoModel.findOne({ cod: req.params.cod });
      if (!producto) {
        res.render("error", { error: "Producto no encontrado" });
      }
      res.render("producto", { producto: producto.toObject() });
    } catch (error) {
      return res.render("error", { error: "Error al obtener el producto" });
    }
  });

// Metodo POST Raiz
router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const productData = {
            ...req.body,
            status: req.body.status === 'true',
            stock: parseInt(req.body.stock),
            precio: parseFloat(req.body.precio)
        };

        if (req.file) {
            productData.thumbnail = req.file.filename;
        }

        const newProduct = new ProductoModel(productData);
        await newProduct.save();

        res.redirect('/productos');
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.render("error", { 
            error: "Error al crear el producto: " + error.message 
        });
    }
});

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

export default router;
