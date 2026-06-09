import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması zorunludur']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat zorunludur'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [String],           // Cloudinary URL'leri

  // Çantaya özel alanlar
  brand: {
    type: String,
    trim: true
  },
  material: {
    type: String,             // "Deri", "Kumaş", "Süet", "Naylon" vb.
    trim: true
  },
  colors: [
    {
      name: String,           // "Siyah", "Kahverengi"
      hex: String,            // "#000000"
      images: [String]        // bu renge özel görseller
    }
  ],
  dimensions: {
    width: Number,            // cm
    height: Number,
    depth: Number
  },
  weight: Number,             // gram
  features: [String],         // ["Su geçirmez", "Laptop bölmesi"]

  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0 }
  },
  reviews: [
    {
      user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name:      String,
      rating:    { type: Number, min: 1, max: 5 },
      comment:   String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  isFeatured:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  tags:        [String]       // ["yeni sezon", "indirim", "çok satан"]
}, { timestamps: true });

// Ortalama puanı otomatik güncelle
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.ratings = { average: 0, count: 0 };
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.ratings = {
      average: Math.round((total / this.reviews.length) * 10) / 10,
      count: this.reviews.length
    };
  }
};

export default mongoose.model('Product', productSchema);
