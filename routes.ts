import { Router } from 'express';
import { searchStore } from './middlewares/searchStore';
import { getStore } from './controllers/store/getStore';
import { getProducts } from './controllers/product/getProducts';
import { getProduct } from './controllers/product/getProduct';
import { getCategories } from './controllers/category/getCategories';
import { getStores } from './controllers/store/getStores';
import { saveOrder } from './controllers/order/saveOrder';
import { updateStore } from './controllers/store/updateStore';
import { updateProducts } from './controllers/product/updateProducts';
import { updateCategories } from './controllers/category/updateCategories';

const router = Router();

router.get('/tiendas', getStores);
router.get('/tiendas/:storeName', searchStore, getStore);
router.put('/tiendas/:storeName', searchStore, updateStore);
router.get('/tiendas/:storeName/productos', searchStore, getProducts);
router.get('/tiendas/:storeName/productos/:productId', searchStore, getProduct);
router.put('/tiendas/:storeName/productos', searchStore, updateProducts);
router.get('/tiendas/:storeName/categorias', searchStore, getCategories);
router.put('/tiendas/:storeName/categorias', searchStore, updateCategories);
router.post('/tiendas/:storeName/order', searchStore, saveOrder);

export default router;
