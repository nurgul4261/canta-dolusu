import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import './Checkout.css';

const paymentMethods = [
  { value: 'credit_card',      label: '💳 Kredi / Banka Kartı' },
  { value: 'bank_transfer',    label: '🏦 Havale / EFT' },
  { value: 'cash_on_delivery', label: '📦 Kapıda Ödeme' },
];

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const coupon   = location.state?.coupon || null;

  const shippingPrice  = subtotal >= 500 ? 0 : 49.90;
  const discountAmount = coupon?.discountAmount || 0;
  const total          = subtotal + shippingPrice - discountAmount;

  const [address, setAddress] = useState(
    user?.addresses?.find(a => a.isDefault) || {
      fullName: user?.name || '', phone: user?.phone || '',
      city: '', district: '', neighborhood: '', addressLine: '', zipCode: ''
    }
  );
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [useExisting,   setUseExisting]   = useState(!!user?.addresses?.length);
  const [selectedAddr,  setSelectedAddr]  = useState(user?.addresses?.find(a => a.isDefault)?._id || '');
  const [loading,       setLoading]       = useState(false);

  const set = (key) => (e) => setAddress(a => ({ ...a, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const shippingAddress = useExisting && selectedAddr
        ? user.addresses.find(a => a._id === selectedAddr)
        : address;

      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i._id, quantity: i.quantity, selectedColor: i.selectedColor })),
        shippingAddress,
        paymentMethod,
        couponCode: coupon?.code || undefined,
      });

      clearCart();
      toast.success('Siparişiniz alındı! 🎉');
      navigate(`/profil?tab=siparisler`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı');
    } finally { setLoading(false); }
  };

  return (
    <div className="checkout-page page-wrapper">
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'left', marginBottom: 32 }}>Ödeme</h1>

        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Sol: Adres + Ödeme */}
          <div className="checkout-left">

            {/* Kayıtlı adresler */}
            {user?.addresses?.length > 0 && (
              <div className="checkout-section">
                <h3>Teslimat Adresi</h3>
                <div className="addr-tabs">
                  <button type="button" className={`addr-tab${useExisting ? ' active' : ''}`} onClick={() => setUseExisting(true)}>Kayıtlı Adreslerim</button>
                  <button type="button" className={`addr-tab${!useExisting ? ' active' : ''}`} onClick={() => setUseExisting(false)}>Yeni Adres</button>
                </div>

                {useExisting ? (
                  <div className="saved-addresses">
                    {user.addresses.map(addr => (
                      <label key={addr._id} className={`saved-addr${selectedAddr === addr._id ? ' selected' : ''}`}>
                        <input type="radio" name="addr" value={addr._id} checked={selectedAddr === addr._id} onChange={() => setSelectedAddr(addr._id)} />
                        <div>
                          <strong>{addr.title}</strong>
                          <p>{addr.fullName} — {addr.phone}</p>
                          <p>{addr.addressLine}, {addr.district}/{addr.city}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* Yeni adres formu */}
            {(!useExisting || !user?.addresses?.length) && (
              <div className="checkout-section">
                <h3>Teslimat Adresi</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Ad Soyad</label>
                    <input className="form-control" value={address.fullName} onChange={set('fullName')} required />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input className="form-control" value={address.phone} onChange={set('phone')} required />
                  </div>
                  <div className="form-group">
                    <label>İl</label>
                    <input className="form-control" value={address.city} onChange={set('city')} required />
                  </div>
                  <div className="form-group">
                    <label>İlçe</label>
                    <input className="form-control" value={address.district} onChange={set('district')} required />
                  </div>
                  <div className="form-group span-2">
                    <label>Mahalle / Sokak</label>
                    <input className="form-control" value={address.neighborhood} onChange={set('neighborhood')} required />
                  </div>
                  <div className="form-group span-2">
                    <label>Açık Adres</label>
                    <textarea className="form-control" rows={3} value={address.addressLine} onChange={set('addressLine')} required />
                  </div>
                  <div className="form-group">
                    <label>Posta Kodu</label>
                    <input className="form-control" value={address.zipCode} onChange={set('zipCode')} />
                  </div>
                </div>
              </div>
            )}

            {/* Ödeme yöntemi */}
            <div className="checkout-section">
              <h3>Ödeme Yöntemi</h3>
              <div className="payment-methods">
                {paymentMethods.map(m => (
                  <label key={m.value} className={`payment-option${paymentMethod === m.value ? ' selected' : ''}`}>
                    <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'bank_transfer' && (
                <div className="bank-info">
                  <p><strong>Hesap Adı:</strong> Çanta Dolusu Tic. Ltd. Şti.</p>
                  <p><strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00</p>
                  <p><strong>Banka:</strong> Ziraat Bankası</p>
                  <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-light)' }}>Sipariş numaranızı açıklama kısmına yazınız.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ: Özet */}
          <div className="checkout-summary">
            <h3>Sipariş Özeti</h3>
            <div className="checkout-items">
              {items.map((item, i) => (
                <div key={i} className="checkout-item">
                  <img src={item.images?.[0]} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    {item.selectedColor && <span>{item.selectedColor}</span>}
                    <span>x{item.quantity}</span>
                  </div>
                  <strong>₺{((item.discountPrice || item.price) * item.quantity).toLocaleString('tr-TR')}</strong>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div className="summary-row"><span>Ara Toplam</span><span>₺{subtotal.toLocaleString('tr-TR')}</span></div>
            <div className="summary-row"><span>Kargo</span><span>{shippingPrice === 0 ? 'Ücretsiz' : `₺${shippingPrice}`}</span></div>
            {discountAmount > 0 && <div className="summary-row" style={{ color: 'var(--success)' }}><span>İndirim</span><span>-₺{discountAmount}</span></div>}
            <hr className="divider" />
            <div className="summary-total"><span>Toplam</span><span>₺{total.toLocaleString('tr-TR')}</span></div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Sipariş oluşturuluyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
