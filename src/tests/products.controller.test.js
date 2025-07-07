import mongoose from "mongoose";
import request from "supertest";
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as JWTStrategy } from 'passport-jwt';
import { router as productsRouter } from "../routes/productsRouter.js";
import { ProductoModel } from "../dao/models/product.model.js";
import { config } from "../config/config.js";

// Configura la app de test
const app = express();
app.use(express.json());

// Generar un JWT válido para tests
const testUser = { email: 'admin@test.com', role: 'admin' };
const testToken = jwt.sign(testUser, config.SECRET, { expiresIn: "1h" });

// ESTRATEGIA 1: CONFIGURAR PASSPORT COMPLETAMENTE PARA TESTS
passport.use(
  'current',
  new JWTStrategy(
    {
      jwtFromRequest: () => testToken, // Devuelve el token válido
      secretOrKey: config.SECRET
    },
    async (payload, done) => {
      return done(null, testUser);
    }
  )
);

// ESTRATEGIA 2: MOCK COMPLETO DE PASSPORT.AUTHENTICATE
const originalAuthenticate = passport.authenticate;
passport.authenticate = function(strategy, options) {
  return function(req, res, next) {
    req.user = testUser;
    return next();
  };
};

// ESTRATEGIA 3: MOCK DE MULTER
app.use((req, res, next) => {
  req.file = null;
  next();
});

// ESTRATEGIA 4: ASEGURAR QUE req.user ESTÉ SIEMPRE DISPONIBLE
app.use((req, res, next) => {
  if (!req.user) {
    req.user = testUser;
  }
  next();
});

// ESTRATEGIA 5: INICIALIZAR PASSPORT
app.use(passport.initialize());

// ESTRATEGIA 6: USAR EL ROUTER
app.use("/api/products", productsRouter);

describe("Controlador de Productos (con base de datos de test)", function () {
  before(async function () {
    await mongoose.connect(config.MONGO_URL);
  });

  beforeEach(async function () {
    await ProductoModel.deleteMany({});
  });

  after(async function () {
    passport.authenticate = originalAuthenticate;
    await mongoose.connection.close();
  });

  it("GET /api/products debe devolver un array vacío si no hay productos", async function () {
    const res = await request(app).get("/api/products");
    if (res.statusCode !== 200) throw new Error("No devolvió 200");
    if (!Array.isArray(res.body.productos))
      throw new Error("productos no es array");
    if (res.body.productos.length !== 0) throw new Error("Debe estar vacío");
  });

  it("GET /api/products debe devolver productos existentes", async function () {
    await ProductoModel.create({
      title: "Test Product",
      code: 1234,
      price: 100,
      stock: 10,
      description: "Test description",
      status: true,
      category: "test",
    });

    const res = await request(app).get("/api/products");
    if (res.statusCode !== 200) throw new Error("No devolvió 200");
    if (!Array.isArray(res.body.productos))
      throw new Error("productos no es array");
    if (res.body.productos.length !== 1)
      throw new Error("Debe haber 1 producto");
    if (res.body.productos[0].title !== "Test Product")
      throw new Error("El producto no coincide");
  });

  it("GET /api/products/:id debe devolver un producto por ID", async function () {
    const producto = await ProductoModel.create({
      title: "Test Product",
      code: 1234,
      price: 100,
      stock: 10,
      description: "Test description",
      status: true,
      category: "test",
    });

    const res = await request(app).get(`/api/products/${producto._id}`);
    if (res.statusCode !== 200) throw new Error("No devolvió 200");
    if (!res.body.producto) throw new Error("No se devolvió el producto");
    if (res.body.producto.title !== "Test Product")
      throw new Error("El producto no coincide");
  });

  it("GET /api/products/:id debe devolver error si el producto no existe", async function () {
    const res = await request(app).get(
      "/api/products/60c72b2f9b1d8c001c8e4e1f"
    );
    if (res.statusCode !== 404)
      throw new Error("Debe devolver 404 si el producto no existe");
    if (res.body.error !== "Producto no encontrado")
      throw new Error("El mensaje de error no es correcto");
  });

  it("POST /api/products debe crear un nuevo producto", async function () {
    const newProduct = {
      title: "New Product",
      code: 5678,
      price: 200,
      stock: 20,
      description: "New description",
      status: true,
      category: "new",
    };

    const res = await request(app)
      .post("/api/products")
      .set('Cookie', [`cookieToken=${testToken}`])
      .send(newProduct);

    if (res.statusCode !== 201) throw new Error(`No devolvió 201, devolvió ${res.statusCode}`);
    if (!res.body.producto) throw new Error("No se devolvió el producto creado");
    if (res.body.producto.title !== "New Product") throw new Error("El producto no coincide");
  });

  it("DELETE /api/products/:id debe eliminar un producto existente", async function () {
    const producto = await ProductoModel.create({
      title: "Product to delete",
      code: 9999,
      price: 300,
      stock: 30,
      description: "Description to delete",
      status: true,
      category: "delete",
    });

    const res = await request(app)
      .delete(`/api/products/${producto._id}`)
      .set('Cookie', [`cookieToken=${testToken}`]);

    if (res.statusCode !== 200) throw new Error("No devolvió 200");
    if (res.body.message !== "Producto eliminado exitosamente")
      throw new Error("El mensaje de éxito no es correcto");

    const deletedProduct = await ProductoModel.findById(producto._id);
    if (deletedProduct)
      throw new Error("El producto no se eliminó correctamente");
  });

  it("DELETE /api/products/:id debe devolver error si el producto no existe", async function () {
    const res = await request(app)
      .delete("/api/products/60c72b2f9b1d8c001c8e4e1f")
      .set('Cookie', [`cookieToken=${testToken}`]);
    if (res.statusCode !== 404)
      throw new Error("Debe devolver 404 si el producto no existe");
    if (res.body.error !== "Producto no encontrado")
      throw new Error("El mensaje de error no es correcto");
  });

  it("PUT /api/products/:id debe actualizar un producto existente", async function () {
    const producto = await ProductoModel.create({
      title: "Product to update",
      code: 8888,
      price: 400,
      stock: 40,
      description: "Description to update",
      status: true,
      category: "update",
    });

    const updatedData = {
      title: "Updated Product",
      price: 450,
    };

    const res = await request(app)
      .put(`/api/products/${producto._id}`)
      .set('Cookie', [`cookieToken=${testToken}`])
      .send(updatedData);

    if (res.statusCode !== 200) throw new Error("No devolvió 200");
    if (!res.body.producto)
      throw new Error("No se devolvió el producto actualizado");
    if (res.body.producto.title !== "Updated Product")
      throw new Error("El producto no se actualizó correctamente");

    const updatedProduct = await ProductoModel.findById(producto._id);
    if (updatedProduct.title !== "Updated Product")
      throw new Error(
        "El producto no se actualizó correctamente en la base de datos"
      );
  });

  it("PUT /api/products/:id debe devolver error si el producto no existe", async function () {
    const updatedData = {
      title: "Non-existent Product",
      price: 500,
    };

    const res = await request(app)
      .put("/api/products/60c72b2f9b1d8c001c8e4e1f")
      .set('Cookie', [`cookieToken=${testToken}`])
      .send(updatedData);

    if (res.statusCode !== 404)
      throw new Error("Debe devolver 404 si el producto no existe");
    if (res.body.error !== "Producto no encontrado")
      throw new Error("El mensaje de error no es correcto");
  });
});