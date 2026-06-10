import express from 'express';
import { getUpsells, createUpsell, updateUpsell, deleteUpsell } from '../controllers/upsellController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',       getUpsells);
router.post('/',      protect, adminOnly, createUpsell);
router.put('/:id',    protect, adminOnly, updateUpsell);
router.delete('/:id', protect, adminOnly, deleteUpsell);

export default router;
