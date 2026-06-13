import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const { items, removeItem, updateQty, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponCode,    setCouponCode]    = useState('');
  const [couponData,    setCouponData]    = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const shippingPrice  = subtotal >= 500 ? 0 : 49.90;
  const discountAmount = couponData?.discountAmount || 0;
  const total          = subtotal + shippingPrice - discountAmount;

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: subtotal });
      setCouponData(data);
      toast.success(`Kupon uygulandı! ₺${data.discountAmount} indirim kazandınız 🎉`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Geçersiz kupon');
      setCouponData(null);
    } finally { setCouponLoading(false); }
  };

  const handleCheckout = () => {
    if (!user) { navigate('/giris', { state: { from: { pathname: '/odeme' } } }); return; }
    navigate('/odeme', { state: { coupon: couponData } });
  };

  if (items.length === 0) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state">
          <p style={{ fontSize: 60 }}>🛍️</p>
          <h3>Sepetiniz boş</h3>
          <p>Beğendiğiniz ürünleri sepete ekleyin.</p>
          <Link to="/urunler" className="btn btn-primary" style={{ marginTop: 20 }}>Alışverişe Başla</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 32 }}>
          Sepetim <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>({items.length} ürün)</span>
        </h1>

        <div className="cart-layout">
          {/* Ürün listesi */}
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={i} className="cart-item">
                <Link to={`/urunler/${item.slug}`} className="cart-item-image">
                  <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/urunler/${item.slug}`} className="cart-item-name">{item.name}</Link>
                  {item.selectedColor && <span className="cart-item-color">Renk: {item.selectedColor}</span>}
                  <span className="cart-item-price">₺{((item.discountPrice || item.price) * item.quantity).toLocaleString('tr-TR')}</span>
                </div>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item._id, item.selectedColor, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.selectedColor, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(item._id, item.selectedColor)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <button className="btn btn-outline btn-sm" onClick={clearCart}>Sepeti Temizle</button>
              <Link to="/urunler" className="btn btn-outline btn-sm"><FiShoppingBag /> Alışverişe Devam</Link>
            </div>
          </div>

          {/* Özet */}
          <div className="cart-summary">
            <h3>Sipariş Özeti</h3>

            <div className="summary-row"><span>Ara Toplam</span><span>₺{subtotal.toLocaleString('tr-TR')}</span></div>
            <div className="summary-row"><span>Kargo</span><span>{shippingPrice === 0 ? <span style={{ color: 'var(--success)' }}>Ücretsiz</span> : `₺${shippingPrice}`}</span></div>
            {discountAmount > 0 && <div className="summary-row discount"><span>İndirim ({couponData.code})</span><span>-₺{discountAmount.toLocaleString('tr-TR')}</span></div>}

            {/* Kupon */}
            <div className="coupon-box">
              <label><FiTag /> Kupon Kodu</label>
              <div className="coupon-input">
                <input className="form-control" placeholder="Kupon kodunuz" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} disabled={!!couponData} />
                {couponData
                  ? <button className="btn btn-outline btn-sm" onClick={() => { setCouponData(null); setCouponCode(''); }}>Kaldır</button>
                  : <button className="btn btn-dark btn-sm" onClick={handleCoupon} disabled={couponLoading}>{couponLoading ? '...' : 'Uygula'}</button>
                }
              </div>
            </div>

            <hr className="divider" />
            <div className="summary-total"><span>Toplam</span><span>₺{total.toLocaleString('tr-TR')}</span></div>
            {subtotal < 500 && <p className="free-shipping-hint">₺{(500 - subtotal).toFixed(0)} daha alışveriş yaparak ücretsiz kargo kazan!</p>}

            <button className="btn btn-primary btn-lg w-full" onClick={handleCheckout}>
              Ödemeye Geç <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
