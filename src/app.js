import express from 'express';
import handlebars from 'express-handlebars';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import methodOverride from 'method-override';
import { iniciarPassport } from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {router as productsRouter} from './routes/productsRouter.js'; 
import {router as cartsRouter} from './routes/cartsRouter.js';
import {router as viewsRouter} from './routes/viewsRouter.js';
import {router as sessionsRouter} from './routes/sessionsRouter.js'; 
import{router as userRouter} from './routes/usersRouter.js'


const app = express();


// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(config.SECRET));

//Motor de Plantillas
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views'); 
app.set('view engine', 'handlebars');

//Carpeta estatica
app.use(express.static(__dirname + '/public'));

//Seteamos el methodOverride para reescribir e interpretar el campo method de un form
app.use(methodOverride('_method'));

iniciarPassport();
app.use(passport.initialize());


//Implementamos los router que creamos
app.use('/api/productos', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/usuarios', userRouter);



//Iniciamos el servidor
app.listen(config.PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${config.PORT}`);
});

//Iniciamos la conexión con MongoDB

const conectar=async()=>{
    try {
        await mongoose.connect(
            config.MONGO_URL,
            {
                dbName: config.DB_NAME
            }
        )
        console.log(`Conexión a DB establecida`)
    } catch (err) {
        console.log(`Error al conectarse con el servidor de BD: ${err}`)
    }
}

conectar();