import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Giriş yapmış kullanıcı kontrolü
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Giriş yapmanız gerekiyor' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    next();
  } catch {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

// Admin kontrolü
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekiyor' });
  }
  next();
};
