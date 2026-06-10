import express from 'express';
import { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',           protect, adminOnly, getCoupons);
router.post('/validate',  protect, validateCoupon);
router.post('/',          protect, adminOnly, createCoupon);
router.put('/:id',        protect, adminOnly, updateCoupon);
router.delete('/:id',     protect, adminOnly, deleteCoupon);

export default router;
