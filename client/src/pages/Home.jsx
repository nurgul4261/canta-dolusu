import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield, FiStar } from 'react-icons/fi';
import api from '../services/api.js';
import ProductCard from '../components/ui/ProductCard.jsx';
import './Home.css';

const Home = () => {
  const [featured,   setFeatured]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

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

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">✦ Yeni Koleksiyon 2025</span>
          <h1 className="hero-title">Her Anın<br />Vazgeçilmezi</h1>
          <p className="hero-desc">
            El işçiliğiyle üretilmiş, özgün tasarımlı çanta koleksiyonumuzu keşfedin.
            Stilinizi yansıtın, farkınızı ortaya koyun.
          </p>
          <div className="hero-btns">
            <Link to="/urunler" className="btn btn-primary btn-lg">Koleksiyonu Keşfet</Link>
            <Link to="/urunler?featured=true" className="btn btn-outline btn-lg">Öne Çıkanlar</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/hero.jpg" alt="Çanta Dolusu Koleksiyon" />
          <div className="hero-badge">
            <span className="badge-number">500+</span>
            <span className="badge-label">Mutlu Müşteri</span>
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
