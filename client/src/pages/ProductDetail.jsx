import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiChevronLeft, FiStar, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { user }   = useAuth();

  const [product,       setProduct]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [activeImg,     setActiveImg]     = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity,      setQuantity]      = useState(1);
  const [reviewForm,    setReviewForm]    = useState({ rating: 5, comment: '' });
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0].name);
      } catch { toast.error('Ürün bulunamadı'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  const handleAddToCart = () => {
    if (product.colors?.length && !selectedColor) return toast.error('Lütfen renk seçin');
    addItem(product, quantity, selectedColor);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Yorum yapmak için giriş yapın');
    setSubmitting(true);
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success('Yorumunuz eklendi');
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hata oluştu');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="empty-state"><h3>Ürün bulunamadı</h3></div>;

  const price       = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : null;

  return (
    <div className="product-detail page-wrapper">
      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/urunler"><FiChevronLeft /> Koleksiyon</Link>
          {product.category && <><span>/</span><Link to={`/urunler?category=${product.category.slug}`}>{product.category.name}</Link></>}
          <span>/</span><span>{product.name}</span>
        </div>

        {/* Ana içerik */}
        <div className="detail-grid">

          {/* Görseller */}
          <div className="detail-images">
            <div className="main-image">
              <img src={product.images?.[activeImg] || '/placeholder.jpg'} alt={product.name} />
              {hasDiscount && <span className="detail-badge">-%{discountPct}</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="thumb-list">
                {product.images.map((img, i) => (
                  <button key={i} className={`thumb${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bilgi */}
          <div className="detail-info">
            {product.category && <Link to={`/urunler?category=${product.category.slug}`} className="detail-category">{product.category.name}</Link>}
            <h1 className="detail-name">{product.name}</h1>

            {/* Puan */}
            {product.ratings?.count > 0 && (
              <div className="detail-rating">
                <span className="stars">{'★'.repeat(Math.round(product.ratings.average))}{'☆'.repeat(5 - Math.round(product.ratings.average))}</span>
                <span>{product.ratings.average} ({product.ratings.count} yorum)</span>
              </div>
            )}

            {/* Fiyat */}
            <div className="detail-price">
              <span className="price-big">₺{price.toLocaleString('tr-TR')}</span>
              {hasDiscount && <span className="price-old">₺{product.price.toLocaleString('tr-TR')}</span>}
              {hasDiscount && <span className="price-save">%{discountPct} indirim</span>}
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Renk seçimi */}
            {product.colors?.length > 0 && (
              <div className="detail-option">
                <label>Renk: <strong>{selectedColor}</strong></label>
                <div className="color-options">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`color-btn${selectedColor === c.name ? ' selected' : ''}`}
                      style={{ background: c.hex }}
                      title={c.name}
                      onClick={() => setSelectedColor(c.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Adet */}
            <div className="detail-option">
              <label>Adet</label>
              <div className="qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <span className="stock-info">{product.stock > 0 ? `${product.stock} adet stokta` : 'Stokta yok'}</span>
            </div>

            {/* Butonlar */}
            <div className="detail-actions">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.stock === 0}>
                <FiShoppingBag /> Sepete Ekle
              </button>
            </div>

            {/* Özellikler */}
            {product.features?.length > 0 && (
              <ul className="detail-features">
                {product.features.map((f, i) => <li key={i}>✦ {f}</li>)}
              </ul>
            )}

            {/* Kargo bilgisi */}
            <div className="detail-shipping">
              <div><FiTruck /> <span>500₺ üzeri ücretsiz kargo</span></div>
              <div><FiRefreshCw /> <span>14 gün iade garantisi</span></div>
            </div>

            {/* Malzeme/ölçü */}
            {(product.material || product.brand) && (
              <div className="detail-meta">
                {product.brand    && <div><span>Marka:</span> {product.brand}</div>}
                {product.material && <div><span>Materyal:</span> {product.material}</div>}
                {product.dimensions?.width && (
                  <div><span>Ölçüler:</span> {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm</div>
                )}
                {product.weight && <div><span>Ağırlık:</span> {product.weight}g</div>}
              </div>
            )}
          </div>
        </div>

        {/* Yorumlar */}
        <div className="reviews-section">
          <h2 className="section-title" style={{ textAlign: 'left' }}>Müşteri Yorumları</h2>
          <div className="section-line" style={{ margin: '12px 0 32px' }} />

          {product.reviews?.length === 0 ? (
            <p className="no-reviews">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((r, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{r.name}</span>
                    <span className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Yorum formu */}
          {user && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>Yorum Yaz</h3>
              <div className="form-group">
                <label>Puanınız</label>
                <div className="star-select">
                  {[1,2,3,4,5].map(n => (
                    <button type="button" key={n} className={n <= reviewForm.rating ? 'star active' : 'star'} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Yorumunuz</label>
                <textarea className="form-control" rows={4} placeholder="Ürün hakkında düşüncelerinizi paylaşın..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
