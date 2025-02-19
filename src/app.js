import express from 'express';
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js'

const app = express();


// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




//Implementamos los router que creamos
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



//Iniciamos el servidor
app.listen(8080, ()=>{
    console.log("Servidor HTTP escuchando en el puerto 8080")
});