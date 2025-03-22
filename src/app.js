import express from 'express';
import handlebars from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import viewsRouter from './routes/viewsRouter.js';

//inicializamos express
const app = express();

//Iniciamos la conexión con MongoDB
mongoose.connect(config.MONGO_URL)
.then(() => {
    console.log('Conectado a MongoDB Atlas');
})
.catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
    process.exit();
});

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Motor de Plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views'); 
app.set('view engine', 'handlebars');

//Carpeta estatica
app.use(express.static(__dirname + '/public'));

//Seteamos el methodOverride para reescribir e interpretar el campo method de un form
app.use(methodOverride('_method'));


//Iniciamos el servidor
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${config.PORT}`);
});


//Implementamos los router que creamos
app.use('/api/productos', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

