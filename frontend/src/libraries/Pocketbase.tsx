import Pocketbase from 'pocketbase/dist/pocketbase.umd';
import config from './../config.json';

const pocketbase = new Pocketbase(config.POCKETBASE_URL);

export default pocketbase;