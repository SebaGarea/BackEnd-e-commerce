import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: dirname(__dirname) + '/../.env' });

if (!process.env.MONGO_URL) {
    throw new Error('La variable MONGO_URL no está definida en el archivo .config');
}

export const config = {
    PORT: process.env.PORT || 8080,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: "Entrega",
    SECRET: "CoderCoder123"
};