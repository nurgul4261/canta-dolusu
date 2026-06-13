import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';
import api from '../services/api.js';
import ProductCard from '../components/ui/ProductCard.jsx';
import './Home.css';

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80',
    tag:   '✦ Yeni Koleksiyon 2025',
    title: 'Her Anın\nVazgeçilmezi',
    desc:  'El işçiliğiyle üretilmiş, özgün tasarımlı çanta koleksiyonumuzu keşfedin.'
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80',
    tag:   '✦ Öne Çıkan Modeller',
    title: 'Şıklığın\nYeni Adresi',
    desc:  'Her kombine uyan çapraz çantalarımızla tarzınızı tamamlayın.'
  },
  {
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80',
    tag:   '✦ Premium Koleksiyon',
    title: 'Kalite &\nZarif Tasarım',
    desc:  'Gerçek deri sırt çantalarımızla her yerde fark yaratın.'
  },
];

const Home = () => {
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [prevSlide,   setPrevSlide]   = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(curr => {
        setPrevSlide(curr);
        return (curr + 1) % heroSlides.length;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (i) => {
    setPrevSlide(activeSlide);
    setActiveSlide(i);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/categories')
        ]);
        setFeatured(prodRes.data.products);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">

      {/* ── HERO SLIDER ── */}
      <section className="hero">
        {/* Görseller */}
        <div className="hero-image">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`hero-slide${i === activeSlide ? ' active' : ''}${i === prevSlide ? ' prev' : ''}`}
            >
              <img src={slide.image} alt={slide.title} />
            </div>
          ))}

          <div className="hero-badge">
            <span className="badge-number">500+</span>
            <span className="badge-label">Mutlu Müşteri</span>
          </div>

          {/* Dots */}
          <div className="hero-dots">
            {heroSlides.map((_, i) => (
              <button key={i} className={`hero-dot${i === activeSlide ? ' active' : ''}`} onClick={() => goToSlide(i)} />
            ))}
          </div>
        </div>

        {/* İçerik */}
        <div className="hero-content">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-text${i === activeSlide ? ' active' : ''}`}>
              <span className="hero-tag">{slide.tag}</span>
              <h1 className="hero-title">{slide.title.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}</h1>
              <p className="hero-desc">{slide.desc}</p>
            </div>
          ))}
          <div className="hero-btns">
            <Link to="/urunler" className="btn btn-primary btn-lg">Koleksiyonu Keşfet</Link>
            <Link to="/urunler?featured=true" className="btn btn-outline btn-lg">Öne Çıkanlar</Link>
          </div>
        </div>
      </section>

      {/* ── ÖZELLİKLER ── */}
      <section className="features">
        <div className="container features-grid">
          {[
            { icon: <FiTruck />,     title: '500₺ Üzeri Ücretsiz Kargo', desc: 'Türkiye\'nin her yerine hızlı teslimat' },
            { icon: <FiRefreshCw />, title: '14 Gün İade Garantisi',      desc: 'Koşulsuz iade ve değişim hakkı' },
            { icon: <FiShield />,    title: 'Güvenli Ödeme',              desc: 'SSL şifreli, 3D Secure ödeme' },
            { icon: <FiStar />,      title: 'Orijinal Ürün Garantisi',    desc: 'Tüm ürünler kalite sertifikalı' }
          ].map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── KATEGORİLER ── */}
      {categories.length > 0 && (
        <section className="section categories-section">
          <div className="container">
            <h2 className="section-title">Kategoriler</h2>
            <div className="section-line" />
            <div className="categories-grid">
              {categories.map(cat => (
                <Link key={cat._id} to={`/urunler?category=${cat.slug}`} className="category-card">
                  <div className="category-card-inner">
                    <h3>{cat.name}</h3>
                    <span>Keşfet <FiArrowRight /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ÖNE ÇIKANLAR ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Öne Çıkan Ürünler</h2>
          <p className="section-subtitle">Bu sezonun en sevilen parçaları</p>
          <div className="section-line" />

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          <div className="section-cta">
            <Link to="/urunler" className="btn btn-outline btn-lg">
              Tüm Ürünleri Gör <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section className="banner">
        <div className="container banner-inner">
          <div className="banner-text">
            <span>✦ Özel Teklif</span>
            <h2>İlk Siparişinde %10 İndirim</h2>
            <p>CANTADOLUSU10 kupon kodunu kullanarak ilk alışverişinde indirimden faydalan.</p>
            <Link to="/kayit" className="btn btn-primary">Hemen Üye Ol</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
