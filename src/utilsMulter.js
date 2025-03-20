import multer from 'multer';
import __dirname from './fileUtils.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${__dirname}/public/img`) // Cambiamos a /img
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    }
});

export const uploader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (supportedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Formato de archivo no soportado'));
        }
    }
});