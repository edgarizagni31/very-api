import { Router } from 'express';
import { searchStore } from './middlewares/searchStore';
import { getStore } from './controllers/store/getStore';
import { getProducts } from './controllers/product/getProducts';
import { getProduct } from './controllers/product/getProduct';
import { getCategories } from './controllers/category/getCategories';
import { getStores } from './controllers/store/getStores';

const router = Router();

router.get('/', getStores);
router.get('/:storeName', searchStore, getStore);
router.get('/:storeName/productos', searchStore, getProducts);
router.get('/:storeName/productos/:productId', searchStore, getProduct);
router.get('/:storeName/categorias', searchStore, getCategories);

export default router;
