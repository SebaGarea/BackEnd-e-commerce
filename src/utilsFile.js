import {dirname} from 'path';
import {fileURLToPath} from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;   

export const cookieExtractor = (req) => {
    return req?.signedCookies?.cookieToken || null;
};

export const generaHash=password=>bcrypt.hashSync(password, 10);
export const validaHash=(pass, hash)=>bcrypt.compareSync(pass, hash);