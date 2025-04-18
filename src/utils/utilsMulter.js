import multer from 'multer';
import __dirname from './utils.js';


//Antes de iniciar multer debemos configurar donde se almacenar los archivos

const storage = multer.diskStorage({
    //destination hace referencia a la carpeta donde se va a guardar el archivo
    destination: function(req, file,cb){
        cb(null,__dirname+'/public/img') //Especificamos la carpeta en este punto
    },
    // filename hace referencia al nombre del archivo
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

export const uploader =multer({storage}) 