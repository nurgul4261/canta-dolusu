import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

import authRoutes     from './routes/authRoutes.js';
import productRoutes  from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes    from './routes/orderRoutes.js';
import userRoutes     from './routes/userRoutes.js';
import couponRoutes   from './routes/couponRoutes.js';
import upsellRoutes   from './routes/upsellRoutes.js';
import contactRoutes  from './routes/contactRoutes.js';

dotenv.config();
connectDB();

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/coupons',    couponRoutes);
app.use('/api/upsell',     upsellRoutes);
app.use('/api/contact',    contactRoutes);

app.get('/', (req, res) => res.json({ message: '👜 Çanta Dolusu API çalışıyor' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server ${PORT} portunda çalışıyor`));
