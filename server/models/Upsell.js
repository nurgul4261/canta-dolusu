import mongoose from 'mongoose';

const upsellSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Hangi ürün sepete eklenince bu upsell gösterilsin
  triggerProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null    // null = herkese göster
  },
  // Hangi kategori için gösterilsin
  triggerCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  // Önerilen ürünler
  products: [
    {
      product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      specialPrice: Number    // varsa özel fiyat
    }
  ],
  title:       String,        // "Bununla birlikte alın"
  description: String,
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Upsell', upsellSchema);
