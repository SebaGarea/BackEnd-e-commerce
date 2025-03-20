// Este archivo nos crea una variable dirname que nos da la ruta de nuestro archivo app.js

import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;   //Exportamos la variable __dirname para poder usarla en otros archivos