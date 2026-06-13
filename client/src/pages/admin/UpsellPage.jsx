import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api.js';
import toast from 'react-hot-toast';
import './UpsellPage.css';

const emptyForm = { name: '', title: '', description: '', triggerProduct: '', triggerCategory: '', products: [], isActive: true };

const UpsellPage = () => {
  const [upsells,    setUpsells]    = useState([]);
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [form,       setForm]       = useState(emptyForm);
  const [selectedProduct, setSelectedProduct] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, pRes, cRes] = await Promise.all([api.get('/upsell'), api.get('/products?limit=100'), api.get('/categories')]);
      setUpsells(uRes.data);
      setProducts(pRes.data.products);
      setCategories(cRes.data);
    } catch { toast.error('Yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const addProduct = () => {
    if (!selectedProduct) return;
    const already = form.products.find(p => p.product === selectedProduct);
    if (already) return toast.error('Bu ürün zaten ekli');
    setForm(f => ({ ...f, products: [...f.products, { product: selectedProduct, specialPrice: '' }] }));
    setSelectedProduct('');
  };

  const removeProduct = (id) => setForm(f => ({ ...f, products: f.products.filter(p => p.product !== id) }));

  const updateSpecialPrice = (id, price) => setForm(f => ({ ...f, products: f.products.map(p => p.product === id ? { ...p, specialPrice: price } : p) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, products: form.products.map(p => ({ product: p.product, specialPrice: p.specialPrice ? Number(p.specialPrice) : undefined })) };
      if (!payload.triggerProduct)  delete payload.triggerProduct;
      if (!payload.triggerCategory) delete payload.triggerCategory;
      await api.post('/upsell', payload);
      toast.success('Upsell oluşturuldu');
      setShowForm(false); setForm(emptyForm);
      fetchAll();
    } catch (err) { toast.error(err.response?.data?.message || 'Hata'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinizden emin misiniz?')) return;
    try { await api.delete(`/upsell/${id}`); toast.success('Silindi'); fetchAll(); }
    catch { toast.error('Hata'); }
  };

  const getProductName = (id) => products.find(p => p._id === id)?.name || id;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Upsell Yönetimi</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(p => !p)}><FiPlus /> Yeni Upsell</button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, color: 'var(--brown)', marginBottom: 20 }}>Yeni Upsell Oluştur</h3>
          <form onSubmit={handleSubmit} className="upsell-form">
            <div className="form-group"><label>İsim (dahili)</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label>Başlık (müşteriye gösterilir)</label><input className="form-control" placeholder="Bununla birlikte alın" value={form.title} onChange={set('title')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Açıklama</label><input className="form-control" value={form.description} onChange={set('description')} /></div>

            <div className="form-group">
              <label>Tetikleyici Ürün <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(boş = herkese göster)</span></label>
              <select className="form-control" value={form.triggerProduct} onChange={set('triggerProduct')}>
                <option value="">Tümü</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Tetikleyici Kategori</label>
              <select className="form-control" value={form.triggerCategory} onChange={set('triggerCategory')}>
                <option value="">Tümü</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Önerilen Ürünler</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <select className="form-control" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                  <option value="">Ürün seçin...</option>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <button type="button" className="btn btn-dark btn-sm" onClick={addProduct}><FiPlus /> Ekle</button>
              </div>
              {form.products.length > 0 && (
                <div className="upsell-product-list">
                  {form.products.map(p => (
                    <div key={p.product} className="upsell-product-item">
                      <span>{getProductName(p.product)}</span>
                      <input className="form-control" type="number" placeholder="Özel fiyat (₺)" value={p.specialPrice} onChange={e => updateSpecialPrice(p.product, e.target.value)} style={{ width: 160 }} />
                      <button type="button" className="btn-icon danger" onClick={() => removeProduct(p.product)}><FiTrash2 /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">Oluştur</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="spinner" /> : (
        <div className="upsell-cards">
          {upsells.map(u => (
            <div key={u._id} className="upsell-card">
              <div className="upsell-card-header">
                <div>
                  <strong>{u.name}</strong>
                  {u.title && <p>{u.title}</p>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: u.isActive ? '#d4edda' : '#fde8e8', color: u.isActive ? 'var(--success)' : 'var(--error)' }}>{u.isActive ? 'Aktif' : 'Pasif'}</span>
                  <button className="btn-icon danger" onClick={() => handleDelete(u._id)}><FiTrash2 /></button>
                </div>
              </div>
              <div className="upsell-card-body">
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {u.products?.length} ürün önerisi
                  {u.triggerProduct ? ' · Belirli ürün' : ''}
                  {u.triggerCategory ? ' · Belirli kategori' : ''}
                  {!u.triggerProduct && !u.triggerCategory ? ' · Herkese göster' : ''}
                </p>
              </div>
            </div>
          ))}
          {upsells.length === 0 && <div className="empty-state"><h3>Henüz upsell yok</h3></div>}
        </div>
      )}
    </div>
  );
};

export default UpsellPage;
