import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import { router as cartsRouter } from '../routes/cartsRouter.js';
import { ProductoModel } from '../dao/models/product.model.js';
import  cartModel  from '../dao/models/cart.model.js';
import { config } from '../config/config.js';

// Configura la app de test
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = { email: 'user@test.com', role: 'user' };
  req.isAuthenticated = () => true;
  next();
});

app.use('/api/carts', cartsRouter);

describe('Controlador de Carritos (con base de datos de test)', function () {
  // Antes de todos los tests, conecta a la base de datos de test
  before(async function () {
    await mongoose.connect(config.MONGO_URL);
  });

  // Limpia las colecciones antes de cada test
  beforeEach(async function () {
    await cartModel.deleteMany({});
    await ProductoModel.deleteMany({});
  });

  // Desconecta después de todos los tests
  after(async function () {
    await mongoose.connection.close();
  });

  it('POST /api/carts debe crear un carrito vacío', async function () {
    const res = await request(app).post('/api/carts');
    
    if (res.statusCode !== 201) throw new Error('No devolvió 201');
    if (!res.body.cart) throw new Error('No se devolvió el carrito');
    if (!Array.isArray(res.body.cart.productos)) throw new Error('productos no es array');
    if (res.body.cart.productos.length !== 0) throw new Error('El carrito no está vacío');
  });

  it('GET /api/carts/:cid debe obtener un carrito por ID', async function () {
    // Crear un carrito de prueba
    const cart = await cartModel.create({ productos: [] });

    const res = await request(app).get(`/api/carts/${cart._id}`);
    
    if (res.statusCode !== 200) throw new Error('No devolvió 200');
    if (!res.body.cart) throw new Error('No se devolvió el carrito');
    if (res.body.cart._id !== cart._id.toString()) throw new Error('El carrito no coincide');
  });

  it('GET /api/carts/:cid debe devolver error si el carrito no existe', async function () {
    const res = await request(app).get('/api/carts/60c72b2f9b1d8c001c8e4e1f'); // ID no existente
    
    if (res.statusCode !== 404) throw new Error('Debe devolver 404 si el carrito no existe');
    if (!res.body.message.includes('no encontrado')) throw new Error('El mensaje de error no es correcto');
  });

  it('POST /api/carts/:cid/product/:pid debe agregar un producto al carrito', async function () {
    // Crear producto y carrito de prueba
    const producto = await ProductoModel.create({
      title: 'Test Product',
      code: 1234,
      price: 100,
      stock: 10,
      description: 'Test description',
      status: true,
      category: 'test'
    });

    const cart = await cartModel.create({ productos: [] });

    const res = await request(app)
      .post(`/api/carts/${cart._id}/product/${producto._id}`)
      .send({ quantity: 2 });
    
    if (res.statusCode !== 200) throw new Error('No devolvió 200');
    if (!res.body.cart) throw new Error('No se devolvió el carrito actualizado');
  });

  it('PUT /api/carts/:cid/products/:pid debe actualizar cantidad de un producto', async function () {
    // Crear producto y carrito con el producto
    const producto = await ProductoModel.create({
      title: 'Test Product',
      code: 1234,
      price: 100,
      stock: 10,
      description: 'Test description',
      status: true,
      category: 'test'
    });

    const cart = await cartModel.create({
      productos: [{ producto: producto._id, quantity: 1 }]
    });

    const res = await request(app)
      .put(`/api/carts/${cart._id}/products/${producto._id}`)
      .send({ quantity: 5 });
    
    if (res.statusCode !== 200) throw new Error('No devolvió 200');
    if (!res.body.cart) throw new Error('No se devolvió el carrito actualizado');
    if (res.body.cart.productos[0].quantity !== 5) throw new Error('La cantidad no se actualizó');
  });

  it('DELETE /api/carts/:cid/product/:pid debe eliminar un producto del carrito', async function () {
    // Crear producto y carrito con el producto
    const producto = await ProductoModel.create({
      title: 'Test Product',
      code: 1234,
      price: 100,
      stock: 10,
      description: 'Test description',
      status: true,
      category: 'test'
    });

    const cart = await cartModel.create({
      productos: [{ producto: producto._id, quantity: 2 }]
    });

    const res = await request(app)
      .delete(`/api/carts/${cart._id}/product/${producto._id}`);
    
    if (res.statusCode !== 200) throw new Error('No devolvió 200');
    if (!res.body.cart) throw new Error('No se devolvió el carrito actualizado');
    if (res.body.cart.productos.length !== 0) throw new Error('El producto no se eliminó');
  });

  it('DELETE /api/carts/:cid debe vaciar el carrito', async function () {
    // Crear producto y carrito con productos
    const producto = await ProductoModel.create({
      title: 'Test Product',
      code: 1234,
      price: 100,
      stock: 10,
      description: 'Test description',
      status: true,
      category: 'test'
    });

    const cart = await cartModel.create({
      productos: [{ producto: producto._id, quantity: 2 }]
    });

    const res = await request(app).delete(`/api/carts/${cart._id}`);
    
    if (res.statusCode !== 200) throw new Error('No devolvió 200');
    if (!res.body.cart) throw new Error('No se devolvió el carrito actualizado');
    if (res.body.cart.productos.length !== 0) throw new Error('El carrito no se vació');
  });
});