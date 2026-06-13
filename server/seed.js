import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB bağlandı');

  // Temizle
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();
  console.log('🗑️  Eski veriler silindi');

  // ── KULLANICILAR ──────────────────────────────────────────
  const users = await User.insertMany([
    {
      name: 'Admin',
      email: 'admin@cantadolusu.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Ayşe Yılmaz',
      email: 'ayse@test.com',
      password: 'test123',
      role: 'user'
    }
  ]);
  console.log('👤 Kullanıcılar oluşturuldu');

  // ── KATEGORİLER ───────────────────────────────────────────
  const categories = await Category.insertMany([
    { name: 'Kol Çantası',    slug: 'kol-cantasi',    description: 'Şık ve kullanışlı kol çantaları', order: 1 },
    { name: 'Çapraz Çanta',   slug: 'capraz-canta',   description: 'Her kombine uyan çapraz çantalar', order: 2 },
    { name: 'Sırt Çantası',   slug: 'sirt-cantasi',   description: 'Günlük ve şık sırt çantaları', order: 3 },
  ]);
  const [kolCanta, caprazCanta, sirtCanta] = categories;
  console.log('📂 Kategoriler oluşturuldu');

  // ── ÜRÜNLER ───────────────────────────────────────────────
  const products = [

    // ── KOL ÇANTALARI ──────────────────────────────────────
    {
      name: 'Sofya Deri Kol Çantası',
      slug: 'sofya-deri-kol-cantasi',
      description: 'Tam tahıl dana derisi kullanılarak üretilmiş, günlük kullanım için ideal kol çantası. Fermuarlı ana bölme, içinde telefon ve kart cebi mevcuttur. Metal tokalı çıkarılabilir omuz askısıyla kol ya da omuzdan taşıma imkânı sunar.',
      price: 1890,
      discountPrice: 1490,
      category: kolCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Gerçek Deri',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
      ],
      colors: [
        { name: 'Siyah',      hex: '#1a1a1a' },
        { name: 'Kahverengi', hex: '#8B4513' },
        { name: 'Krem',       hex: '#F5F5DC' }
      ],
      dimensions: { width: 28, height: 20, depth: 10 },
      weight: 450,
      features: ['Gerçek dana derisi', 'Çıkarılabilir omuz askısı', 'Metal fermuar', 'İç kart cebi'],
      stock: 25,
      sku: 'CD-KOL-001',
      isFeatured: true,
      tags: ['yeni sezon', 'deri', 'hediye']
    },
    {
      name: 'Minimal Rugan Kol Çantası',
      slug: 'minimal-rugan-kol-cantasi',
      description: 'Pürüzsüz rugan yüzeyiyle dikkat çeken bu minimalist kol çantası, akşam davetlerinden günlük kullanıma uzanan geniş bir yelpazede stilinizi tamamlar. Manyetik kapaklı tasarımı ve altın rengi metal detaylarıyla zarif bir görünüm sunar.',
      price: 990,
      discountPrice: null,
      category: kolCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Rugan (Suni Deri)',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600'
      ],
      colors: [
        { name: 'Siyah', hex: '#1a1a1a' },
        { name: 'Kırmızı', hex: '#C0392B' },
        { name: 'Lacivert', hex: '#1B2A4A' }
      ],
      dimensions: { width: 24, height: 16, depth: 8 },
      weight: 320,
      features: ['Manyetik kapak', 'Altın metal toka', 'Kart bölmesi', 'Ayna'],
      stock: 40,
      sku: 'CD-KOL-002',
      isFeatured: false,
      tags: ['gece', 'rugan', 'şık']
    },
    {
      name: 'Bohem Hasır Kol Çantası',
      slug: 'bohem-hasir-kol-cantasi',
      description: 'El örgüsü hasır dokusundan üretilen bu çanta, yaz aylarının ve plaj kombinlerinin vazgeçilmezi. Deri saplı ve fermuarlı, içinde süet astarlı geniş bir bölme bulunmaktadır. Doğal ve çevre dostu malzeme kullanılmıştır.',
      price: 750,
      discountPrice: 599,
      category: kolCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Hasır & Deri',
      images: [
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600',
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600'
      ],
      colors: [
        { name: 'Doğal', hex: '#D4B483' },
        { name: 'Beyaz', hex: '#FAFAFA' }
      ],
      dimensions: { width: 30, height: 22, depth: 12 },
      weight: 280,
      features: ['El örgüsü hasır', 'Deri sap', 'Süet iç astar', 'Fermuar kapak'],
      stock: 18,
      sku: 'CD-KOL-003',
      isFeatured: true,
      tags: ['yaz', 'bohem', 'hasır', 'plaj']
    },

    // ── ÇAPRAZ ÇANTALAR ────────────────────────────────────
    {
      name: 'Urban Mini Çapraz Çanta',
      slug: 'urban-mini-capraz-canta',
      description: 'Şehir hayatının hızına ayak uyduran bu kompakt çapraz çanta, telefon, kart ve anahtarlarınızı kolayca taşımanızı sağlar. Ayarlanabilir zincir askısı ve çift fermuar bölmesiyle hem şık hem güvenlidir.',
      price: 650,
      discountPrice: 520,
      category: caprazCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Suni Deri',
      images: [
        'https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?w=600',
        'https://images.unsplash.com/photo-1624913503273-5f9c4e980dba?w=600'
      ],
      colors: [
        { name: 'Siyah',    hex: '#1a1a1a' },
        { name: 'Bej',      hex: '#C9B99A' },
        { name: 'Yeşil',    hex: '#4A6741' },
        { name: 'Pembe',    hex: '#E8A0BF' }
      ],
      dimensions: { width: 18, height: 14, depth: 6 },
      weight: 200,
      features: ['Zincir askı', 'Çift bölme', 'Ön cep', 'Ayarlanabilir askı'],
      stock: 55,
      sku: 'CD-CAP-001',
      isFeatured: true,
      tags: ['mini', 'günlük', 'şehir', 'çok satan']
    },
    {
      name: 'Vintage Postacı Çapraz Çanta',
      slug: 'vintage-postaci-capraz-canta',
      description: 'Vintage ilhamıyla tasarlanan bu postacı çantası, deri görünümlü kumaş yapısıyla hem hafif hem de dayanıklıdır. Tablet veya küçük notebook sığabilecek büyüklükteki ana bölmesi ve ön organizatör cebiyle iş ve günlük kullanım için idealdir.',
      price: 1150,
      discountPrice: null,
      category: caprazCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Canvas & Deri',
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600'
      ],
      colors: [
        { name: 'Kahverengi', hex: '#8B4513' },
        { name: 'Haki',       hex: '#8B864E' },
        { name: 'Siyah',      hex: '#1a1a1a' }
      ],
      dimensions: { width: 32, height: 26, depth: 10 },
      weight: 520,
      features: ['Tablet bölmesi', 'Organizatör cep', 'Ayarlanabilir deri askı', 'Manyetik kapak'],
      stock: 30,
      sku: 'CD-CAP-002',
      isFeatured: false,
      tags: ['vintage', 'postacı', 'ofis', 'unisex']
    },
    {
      name: 'Kapitone Zincir Askılı Çapraz Çanta',
      slug: 'kapitone-zincir-askili-capraz-canta',
      description: 'Kapitone dikiş detaylarıyla lüks bir görünüm sunan bu çapraz çanta, altın zincir askısıyla her kombini tamamlar. Akşam yemeklerinden hafta sonu gezilerine kadar her ortama uyum sağlar.',
      price: 1350,
      discountPrice: 1099,
      category: caprazCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Suni Deri',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600'
      ],
      colors: [
        { name: 'Siyah',  hex: '#1a1a1a' },
        { name: 'Krem',   hex: '#F5F5DC' },
        { name: 'Bordo',  hex: '#800020' }
      ],
      dimensions: { width: 20, height: 15, depth: 7 },
      weight: 300,
      features: ['Kapitone dikiş', 'Altın zincir askı', 'İç ayna', 'Kart cebi'],
      stock: 22,
      sku: 'CD-CAP-003',
      isFeatured: true,
      tags: ['kapitone', 'lüks', 'gece', 'zincir']
    },

    // ── SIRT ÇANTALARI ─────────────────────────────────────
    {
      name: 'Explorer Günlük Sırt Çantası',
      slug: 'explorer-gunluk-sirt-cantasi',
      description: 'Su geçirmez nylon kumaşı ve ergonomik sırt desteğiyle uzun günlere hazır bir sırt çantası. 15.6" laptop bölmesi, USB şarj çıkışı ve çoklu organizatör cebiyle hem öğrenci hem profesyoneller için ideal.',
      price: 1299,
      discountPrice: 999,
      category: sirtCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Su Geçirmez Nylon',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600'
      ],
      colors: [
        { name: 'Siyah',    hex: '#1a1a1a' },
        { name: 'Lacivert', hex: '#1B2A4A' },
        { name: 'Gri',      hex: '#808080' }
      ],
      dimensions: { width: 30, height: 45, depth: 15 },
      weight: 750,
      features: ['15.6" laptop bölmesi', 'USB şarj çıkışı', 'Su geçirmez', 'Ergonomik sırt desteği', 'Troll kolu geçiş'],
      stock: 35,
      sku: 'CD-SRT-001',
      isFeatured: true,
      tags: ['laptop', 'okul', 'iş', 'su geçirmez', 'çok satan']
    },
    {
      name: 'Deri Mini Sırt Çantası',
      slug: 'deri-mini-sirt-cantasi',
      description: 'Gerçek deri yapısıyla hem zarif hem dayanıklı bu mini sırt çantası, hafta sonu gezileri ve günlük kullanım için mükemmel. Küçük boyutuna karşın üç bölmesiyle şaşırtıcı bir organizasyon kapasitesi sunar.',
      price: 2200,
      discountPrice: null,
      category: sirtCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Gerçek Deri',
      images: [
        'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'
      ],
      colors: [
        { name: 'Kahverengi', hex: '#8B4513' },
        { name: 'Siyah',      hex: '#1a1a1a' },
        { name: 'Konyak',     hex: '#A0522D' }
      ],
      dimensions: { width: 22, height: 28, depth: 10 },
      weight: 600,
      features: ['Gerçek dana derisi', 'Üç bölme', 'Ayarlanabilir askı', 'Metal toka'],
      stock: 15,
      sku: 'CD-SRT-002',
      isFeatured: true,
      tags: ['deri', 'mini', 'şık', 'premium']
    },
    {
      name: 'Bohem Kelebek Sırt Çantası',
      slug: 'bohem-kelebek-sirt-cantasi',
      description: 'İşlemeli nakış detayları ve püskül süslemeleriyle benzersiz bir görünüm sunan bu bohem sırt çantası, özgün tarzını yansıtmak isteyenler için tasarlandı. Vegan deri ve dokuma kumaşın mükemmel uyumuyla üretilmiştir.',
      price: 870,
      discountPrice: 699,
      category: sirtCanta._id,
      brand: 'Çanta Dolusu',
      material: 'Vegan Deri & Dokuma',
      images: [
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600',
        'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600'
      ],
      colors: [
        { name: 'Çok Renkli', hex: '#E8D5B7' },
        { name: 'Kahve',      hex: '#795548' }
      ],
      dimensions: { width: 26, height: 34, depth: 12 },
      weight: 480,
      features: ['El işi nakış', 'Püskül detay', 'Vegan deri', 'Çift bölme'],
      stock: 20,
      sku: 'CD-SRT-003',
      isFeatured: false,
      tags: ['bohem', 'nakış', 'vegan', 'özgün']
    }
  ];

  await Product.insertMany(products);
  console.log(`🛍️  ${products.length} ürün oluşturuldu`);

  console.log('\n✅ Seed tamamlandı!');
  console.log('──────────────────────────────');
  console.log('👤 Admin → admin@cantadolusu.com / admin123');
  console.log('👤 Test  → ayse@test.com / test123');
  console.log(`📂 ${categories.length} kategori | 🛍️  ${products.length} ürün`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => {
  console.error('❌ Seed hatası:', err);
  process.exit(1);
});
