import express from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, addReview } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',              getProducts);
router.get('/:slug',         getProductBySlug);
router.post('/',             protect, adminOnly, createProduct);
router.put('/:id',           protect, adminOnly, updateProduct);
router.delete('/:id',        protect, adminOnly, deleteProduct);
router.post('/:id/reviews',  protect, addReview);

export default router;
