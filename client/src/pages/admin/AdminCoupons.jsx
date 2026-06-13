import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import './AdminCoupons.css';

const emptyForm = { code: '', type: 'percentage', discount: '', minOrderAmount: 0, maxUses: '', expiresAt: '', isActive: true };

const AdminCoupons = () => {
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(emptyForm);

  const fetchCoupons = async () => {
    setLoading(true);
    try { const { data } = await api.get('/coupons'); setCoupons(data); }
    catch { toast.error('Yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', { ...form, discount: Number(form.discount), minOrderAmount: Number(form.minOrderAmount), maxUses: form.maxUses ? Number(form.maxUses) : null });
      toast.success('Kupon oluşturuldu');
      setShowForm(false); setForm(emptyForm);
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Hata'); }
  };

  const handleToggle = async (coupon) => {
    try {
      await api.put(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      toast.success(coupon.isActive ? 'Kupon devre dışı bırakıldı' : 'Kupon aktifleştirildi');
      fetchCoupons();
    } catch { toast.error('Hata'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Kuponu silmek istediğinizden emin misiniz?')) return;
    try { await api.delete(`/coupons/${id}`); toast.success('Silindi'); fetchCoupons(); }
    catch { toast.error('Silinemedi'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Kuponlar</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(p => !p)}>
          <FiPlus /> Yeni Kupon
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, color: 'var(--brown)', marginBottom: 20 }}>Yeni Kupon Oluştur</h3>
          <form onSubmit={handleSubmit} className="coupon-form">
            <div className="form-group">
              <label>Kupon Kodu</label>
              <input className="form-control" placeholder="YAZA2025" value={form.code} onChange={set('code')} required style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="form-group">
              <label>İndirim Türü</label>
              <select className="form-control" value={form.type} onChange={set('type')}>
                <option value="percentage">Yüzde (%)</option>
                <option value="fixed">Sabit Tutar (₺)</option>
              </select>
            </div>
            <div className="form-group">
              <label>İndirim {form.type === 'percentage' ? '(%)' : '(₺)'}</label>
              <input className="form-control" type="number" value={form.discount} onChange={set('discount')} required min={1} max={form.type === 'percentage' ? 100 : undefined} />
            </div>
            <div className="form-group">
              <label>Min. Sipariş Tutarı (₺)</label>
              <input className="form-control" type="number" value={form.minOrderAmount} onChange={set('minOrderAmount')} />
            </div>
            <div className="form-group">
              <label>Maks. Kullanım (boş = sınırsız)</label>
              <input className="form-control" type="number" value={form.maxUses} onChange={set('maxUses')} placeholder="Sınırsız" />
            </div>
            <div className="form-group">
              <label>Son Kullanma Tarihi</label>
              <input className="form-control" type="date" value={form.expiresAt} onChange={set('expiresAt')} required />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">Kupon Oluştur</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <div className="coupon-list">
        {loading ? <div className="spinner" /> : coupons.map(coupon => {
          const expired = new Date(coupon.expiresAt) < new Date();
          return (
            <div key={coupon._id} className={`coupon-card${!coupon.isActive || expired ? ' inactive' : ''}`}>
              <div className="coupon-code">{coupon.code}</div>
              <div className="coupon-details">
                <span className="coupon-value">
                  {coupon.type === 'percentage' ? `%${coupon.discount}` : `₺${coupon.discount}`} indirim
                </span>
                {coupon.minOrderAmount > 0 && <span>Min. ₺{coupon.minOrderAmount}</span>}
                <span>{coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''} kullanım</span>
                <span className={expired ? 'expired' : ''}>
                  {expired ? '⚠️ Süresi doldu' : `Son: ${new Date(coupon.expiresAt).toLocaleDateString('tr-TR')}`}
                </span>
              </div>
              <div className="coupon-actions">
                <button className="btn-icon" onClick={() => handleToggle(coupon)} title={coupon.isActive ? 'Devre dışı bırak' : 'Aktifleştir'}>
                  {coupon.isActive ? <FiToggleRight style={{ color: 'var(--success)' }} size={20} /> : <FiToggleLeft size={20} />}
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(coupon._id)}><FiTrash2 /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCoupons;
