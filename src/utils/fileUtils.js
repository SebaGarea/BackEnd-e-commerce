import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsFilePath = join(__dirname, '../data/products.json');
const cartsFilePath = join(__dirname, '../data/carts.json');

// Función para leer un archivo y parsear su contenido JSON
export const readFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data); 
    } catch (error) {
        console.error(`Error reading file from disk: ${error}`);
        return []; 
    }
};

// Función para escribir datos en un archivo en formato JSON
export const writeFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // Escribimos los datos en el archivo
    } catch (error) {
        console.error(`Error writing file to disk: ${error}`);
    }
};

// Funciones específicas para leer y escribir productos
export const readProducts = () => readFile(productsFilePath);
export const writeProducts = (data) => writeFile(productsFilePath, data);

// Funciones específicas para leer y escribir carritos
export const readCarts = () => readFile(cartsFilePath);
export const writeCarts = (data) => writeFile(cartsFilePath, data);
