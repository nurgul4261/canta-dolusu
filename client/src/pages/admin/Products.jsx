import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const emptyForm = { name: '', slug: '', description: '', price: '', discountPrice: '', category: '', brand: '', material: '', stock: '', images: '', isFeatured: false, isActive: true, tags: '' };

const AdminProducts = () => {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.get('/products?limit=50'), api.get('/categories')]);
      setProducts(pRes.data.products);
      setCategories(cRes.data);
    } catch { toast.error('Yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        stock:         Number(form.stock),
        images:        form.images.split('\n').map(s => s.trim()).filter(Boolean),
        tags:          form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editId) await api.put(`/products/${editId}`, payload);
      else        await api.post('/products', payload);
      toast.success(editId ? 'Ürün güncellendi' : 'Ürün eklendi');
      setShowForm(false); setEditId(null); setForm(emptyForm);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || 'Hata'); }
  };

  const handleEdit = (p) => {
    setForm({ ...p, images: p.images?.join('\n') || '', tags: p.tags?.join(', ') || '', category: p.category?._id || p.category || '', discountPrice: p.discountPrice || '' });
    setEditId(p._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Ürünü silmek istediğinizden emin misiniz?')) return;
    try { await api.delete(`/products/${id}`); toast.success('Silindi'); fetchProducts(); }
    catch { toast.error('Silinemedi'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Ürünler</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(p => !p); setEditId(null); setForm(emptyForm); }}>
          <FiPlus /> Yeni Ürün
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, color: 'var(--brown)', marginBottom: 20 }}>{editId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group"><label>Ürün Adı</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label>Slug</label><input className="form-control" value={form.slug} onChange={set('slug')} required /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Açıklama</label><textarea className="form-control" rows={3} value={form.description} onChange={set('description')} required /></div>
            <div className="form-group"><label>Fiyat (₺)</label><input className="form-control" type="number" value={form.price} onChange={set('price')} required /></div>
            <div className="form-group"><label>İndirimli Fiyat (₺)</label><input className="form-control" type="number" value={form.discountPrice} onChange={set('discountPrice')} /></div>
            <div className="form-group"><label>Kategori</label>
              <select className="form-control" value={form.category} onChange={set('category')} required>
                <option value="">Seçin...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Stok</label><input className="form-control" type="number" value={form.stock} onChange={set('stock')} required /></div>
            <div className="form-group"><label>Marka</label><input className="form-control" value={form.brand} onChange={set('brand')} /></div>
            <div className="form-group"><label>Materyal</label><input className="form-control" value={form.material} onChange={set('material')} /></div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Görseller (her satıra bir URL)</label><textarea className="form-control" rows={3} value={form.images} onChange={set('images')} /></div>
            <div className="form-group"><label>Etiketler (virgülle ayır)</label><input className="form-control" value={form.tags} onChange={set('tags')} /></div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={set('isFeatured')} />
              <label htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>Öne Çıkan</label>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary">{editId ? 'Güncelle' : 'Ekle'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditId(null); }}>İptal</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? <div className="spinner" style={{ margin: 40 }} /> : (
          <table className="admin-table">
            <thead><tr><th>Görsel</th><th>Ürün</th><th>Kategori</th><th>Fiyat</th><th>Stok</th><th>Durum</th><th>İşlem</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td><img src={p.images?.[0]} alt={p.name} /></td>
                  <td><strong style={{ fontSize: 13 }}>{p.name}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.brand}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.category?.name}</td>
                  <td>
                    <strong>₺{(p.discountPrice || p.price).toLocaleString('tr-TR')}</strong>
                    {p.discountPrice && <span style={{ fontSize: 11, color: 'var(--text-light)', textDecoration: 'line-through', marginLeft: 4 }}>₺{p.price.toLocaleString('tr-TR')}</span>}
                  </td>
                  <td style={{ color: p.stock < 5 ? 'var(--error)' : 'var(--text)' }}>{p.stock}</td>
                  <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: p.isActive ? '#d4edda' : '#fde8e8', color: p.isActive ? 'var(--success)' : 'var(--error)' }}>{p.isActive ? 'Aktif' : 'Pasif'}</span></td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-icon" onClick={() => handleEdit(p)}><FiEdit2 /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
