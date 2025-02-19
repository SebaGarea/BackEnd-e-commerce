import { Router } from 'express';
import { readProducts, writeProducts } from '../utils/fileUtils.js';

const router = Router();

// Metodo Get Raiz
router.get('/', async (req, res) => {
    const products = await readProducts(); // Leemos los productos del archivo
    res.json({ products });
});

// Metodo GET id
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const products = await readProducts(); // Leemos los productos del archivo

    // Buscamos el producto por id
    const product = products.find(product => product.id == productId);

    // Validamos si el producto existe
    if (!product) {
        return res.status(404).json({ status: 'error', error: 'Product not found' });
    }

    // Si existe lo devolvemos
    res.json({ product });
});

// Metodo POST Raiz
router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    const products = await readProducts(); // Leemos los productos del archivo

    // Validamos que todos los campos esten completos
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).json({
            status: 'error',
            error: 'Todos los campos son obligatorios',
        });
    }

    // Validamos que price y stock sean numbers
    if (typeof price !== 'number' || typeof stock !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: 'Price y stock deben ser números',
        });
    }

    // Validación del code antes de crear el producto
    const isDuplicateCode = products.some(product => product.code === code);
    if (isDuplicateCode) {
        return res.status(400).json({
            status: 'error',
            message: `El código ${code} ya existe en otro producto`,
        });
    }

    // Generemos un id unico
    const maxId = products.length > 0 ? Math.max(...products.map(product => product.id)) : 0;
    const newId = maxId + 1;

    // Creamos el nuevo producto
    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        stock,
        status: true,
        category,
    };

    // Agregamos el producto al array
    products.push(newProduct);
    await writeProducts(products); // Escribimos los productos actualizados en el archivo

    res.status(201).json({
        status: 'success',
        message: 'Producto creado',
        product: newProduct,
    });
});

// Metodo PUT
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updateFields = req.body;
    const products = await readProducts(); // Leemos los productos del archivo

    // Validamos que no se actualice el ID
    if (updateFields.id) {
        return res.status(400).json({
            status: 'error',
            message: 'No se puede actualizar el ID',
        });
    }

    // Buscamos el indice del producto
    const productIndex = products.findIndex(product => product.id == productId);

    // Validamos si el producto existe
    if (productIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'Producto no encontrado',
        });
    }

    // Validamos los tipos de datos si se actualizan price o stock
    if (updateFields.price && typeof updateFields.price !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: 'Price debe ser un número',
        });
    }

    if (updateFields.stock && typeof updateFields.stock !== 'number') {
        return res.status(400).json({
            status: 'error',
            message: 'Stock debe ser un número',
        });
    }

    // Actualizamos el producto manteniendo el id original
    products[productIndex] = {
        ...products[productIndex], // Mantenemos los datos originales
        ...updateFields, // Actualizamos con los nuevos campos
        id: products[productIndex].id, // Aseguramos que el id no cambie
    };

    await writeProducts(products); // Escribimos los productos actualizados en el archivo

    res.json({
        status: 'success',
        message: 'Producto actualizado',
        product: products[productIndex],
    });
});

// Metodo DELETE :pid
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const products = await readProducts(); // Leemos los productos del archivo
    const productIndex = products.findIndex(product => product.id == productId);

    if (productIndex === -1) {
        return res.status(404).json({
            status: 'error',
            message: 'Producto no encontrado',
        });
    }

    const deletedProduct = products[productIndex];
    products.splice(productIndex, 1);
    await writeProducts(products); // Escribimos los productos actualizados en el archivo

    res.json({
        status: 'success',
        message: 'Producto eliminado exitosamente',
        deletedProduct,
    });
});

export default router;
