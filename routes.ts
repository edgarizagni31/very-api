import { Router } from 'express';
import { searchStore } from './middlewares/searchStore';
import { getStore } from './controllers/store/getStore';
import { getProducts } from './controllers/product/getProducts';
import { getProduct } from './controllers/product/getProduct';
import { getCategories } from './controllers/category/getCategories';
import { getStores } from './controllers/store/getStores';
import { saveOrder } from './controllers/order/saveOrder';

const router = Router();

router.get('/tiendas', getStores);
router.get('/tiendas/:storeName', searchStore, getStore);
router.get('/tiendas/:storeName/productos', searchStore, getProducts);
router.get('/tiendas/:storeName/productos/:productId', searchStore, getProduct);
router.get('/tiendas/:storeName/categorias', searchStore, getCategories);
router.post('/tiendas/:storeName/order', searchStore, saveOrder);

export default router;
