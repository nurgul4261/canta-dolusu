import express from 'express';
import { getAllUsers, getUserById, updateProfile, addAddress, updateAddress, deleteAddress, updateUserRole, deleteUser } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',                       protect, adminOnly, getAllUsers);
router.get('/:id',                    protect, adminOnly, getUserById);
router.put('/profile',                protect, updateProfile);
router.post('/addresses',             protect, addAddress);
router.put('/addresses/:addressId',   protect, updateAddress);
router.delete('/addresses/:addressId',protect, deleteAddress);
router.put('/:id/role',               protect, adminOnly, updateUserRole);
router.delete('/:id',                 protect, adminOnly, deleteUser);

export default router;
