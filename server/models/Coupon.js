import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Kupon kodu zorunludur'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],  // yüzde veya sabit tutar
    required: true
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxUses: {
    type: Number,
    default: null    // null = sınırsız
  },
  usedCount: {
    type: Number,
    default: 0
  },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Kuponun geçerli olup olmadığını kontrol et
couponSchema.methods.isValid = function (orderAmount, userId) {
  if (!this.isActive) return { valid: false, message: 'Bu kupon aktif değil' };
  if (new Date() > this.expiresAt) return { valid: false, message: 'Kupon süresi dolmuş' };
  if (this.maxUses && this.usedCount >= this.maxUses) return { valid: false, message: 'Kupon kullanım limiti doldu' };
  if (orderAmount < this.minOrderAmount) return { valid: false, message: `Minimum sipariş tutarı ₺${this.minOrderAmount}` };
  if (this.usedBy.includes(userId)) return { valid: false, message: 'Bu kuponu daha önce kullandınız' };
  return { valid: true };
};

export default mongoose.model('Coupon', couponSchema);
