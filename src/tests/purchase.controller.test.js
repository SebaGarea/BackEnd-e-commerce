import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import { router as cartsRouter } from '../routes/cartsRouter.js';
import { ProductoModel } from '../dao/models/product.model.js';
import  cartModel  from '../dao/models/cart.model.js';
import { config } from '../config/config.js';


const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = { email: 'test@test.com', role: 'user' };
  req.isAuthenticated = () => true;
  next();
});

app.use('/api/carts', cartsRouter);

describe('Purchase Controller (con base de datos de test)', function () {
  
  before(async function () {
    await mongoose.connect(config.MONGO_URL);
  });

  
  beforeEach(async function () {
    await cartModel.deleteMany({});
    await ProductoModel.deleteMany({});
  });

 
  after(async function () {
    await mongoose.connection.close();
  });

  it('POST /api/carts/:cid/purchase debe procesar compra exitosa', async function () {
    
    const producto = await ProductoModel.create({
      title: 'Product Test',
      code: 1111,
      price: 100,
      stock: 5,
      description: 'Test',
      status: true,
      category: 'test'
    });

  
    const cart = await cartModel.create({
      productos: [{ producto: producto._id, quantity: 2 }]
    });

         
    const res = await request(app)
      .post(`/api/carts/${cart._id}/purchase`)
      .send();

    if (res.statusCode !== 200) throw new Error('No procesó la compra');
    if (res.body.status !== 'success') throw new Error('Compra no exitosa');
    
    
    const updatedProduct = await ProductoModel.findById(producto._id);
    if (updatedProduct.stock !== 3) throw new Error('El stock no se actualizó correctamente');
  });

  it('POST /api/carts/:cid/purchase debe manejar productos sin stock', async function () {
    
    const producto = await ProductoModel.create({
      title: 'Product Test',
      code: 2222,
      price: 100,
      stock: 0, 
      description: 'Test',
      status: true,
      category: 'test'
    });

    
    const cart = await cartModel.create({
      productos: [{ producto: producto._id, quantity: 1 }]
    });

    const res = await request(app)
      .post(`/api/carts/${cart._id}/purchase`)
      .send();

    if (res.statusCode !== 200) throw new Error('No procesó la compra');
    if (res.body.status !== 'success') throw new Error('Compra no exitosa');
    if (res.body.productsNotPurchased.length !== 1) throw new Error('Debe haber productos no comprados');
  });
});