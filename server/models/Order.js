import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [
    {
      product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name:         String,
      image:        String,
      price:        { type: Number, required: true },
      quantity:     { type: Number, required: true, min: 1 },
      selectedColor: String
    }
  ],
  shippingAddress: {
    fullName:     String,
    phone:        String,
    city:         String,
    district:     String,
    neighborhood: String,
    addressLine:  String,
    zipCode:      String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  paymentResult: {
    id:         String,
    status:     String,
    updateTime: String
  },
  coupon: {
    code:     String,
    discount: Number
  },
  upsellItems: [
    {
      product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:     String,
      price:    Number,
      quantity: Number
    }
  ],
  itemsPrice:    { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },
  discountAmount:{ type: Number, default: 0 },
  totalPrice:    { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isPaid:      { type: Boolean, default: false },
  paidAt:      Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  trackingNumber: String,
  notes: String
}, { timestamps: true });

// Sipariş numarası otomatik oluştur
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const date = new Date();
    const prefix = `CD${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
