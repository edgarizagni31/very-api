import express from 'express';
import morgan from 'morgan';
import coors from 'cors';
import * as dotenv from 'dotenv';

import { searchStore } from './middlewares/searchStore';
import { getCategories } from './controllers/category/getCategories';
import { getStores } from './controllers/store/getStores';
import { getStore } from './controllers/store/getStore';
import { getProducts } from './controllers/product/getProducts';
import { getProduct } from './controllers/product/getProduct';

const app = express();

dotenv.config();

app.use(coors());
app.use(morgan('dev'));
app.set('subdomain offset', 1);
app.set('port', process.env.PORT || '8080');
app.use(express.json());

app.get('/', searchStore, getStore);
app.get('/tiendas', getStores);
app.get('/productos', searchStore, getProducts);
app.get('/productos/:productId', searchStore, getProduct);
app.get('/categorias', searchStore, getCategories);

app.listen(app.get('port'), () => {
  console.log(`server on port http://localhost:${app.get('port')}`);
});
