import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const emptyForm = { name: '', slug: '', description: '', order: 0, isActive: true };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(emptyForm);

  const fetchCategories = async () => {
    setLoading(true);
    try { const { data } = await api.get('/categories'); setCategories(data); }
    catch { toast.error('Yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // Türkçe slug otomatiği
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm(f => ({ ...f, name, slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/categories/${editId}`, form);
      else        await api.post('/categories', form);
      toast.success(editId ? 'Güncellendi' : 'Kategori eklendi');
      setShowForm(false); setEditId(null); setForm(emptyForm);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Hata'); }
  };

  const handleEdit = (cat) => {
    setForm(cat); setEditId(cat._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Kategoriyi silmek istediğinizden emin misiniz?')) return;
    try { await api.delete(`/categories/${id}`); toast.success('Silindi'); fetchCategories(); }
    catch { toast.error('Silinemedi'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>Kategoriler</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(p => !p); setEditId(null); setForm(emptyForm); }}>
          <FiPlus /> Yeni Kategori
        </button>
      </div>

      {showForm && (
        <div className="admin-card" style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, color: 'var(--brown)', marginBottom: 20 }}>{editId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 640 }}>
            <div className="form-group">
              <label>Kategori Adı</label>
              <input className="form-control" value={form.name} onChange={handleNameChange} required />
            </div>
            <div className="form-group">
              <label>Slug</label>
              <input className="form-control" value={form.slug} onChange={set('slug')} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Açıklama</label>
              <input className="form-control" value={form.description} onChange={set('description')} />
            </div>
            <div className="form-group">
              <label>Sıralama</label>
              <input className="form-control" type="number" value={form.order} onChange={set('order')} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={set('isActive')} />
              <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>Aktif</label>
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
            <thead><tr><th>Ad</th><th>Slug</th><th>Açıklama</th><th>Sıra</th><th>Durum</th><th>İşlem</th></tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id}>
                  <td><strong>{cat.name}</strong></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{cat.slug}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, maxWidth: 200 }}>{cat.description}</td>
                  <td>{cat.order}</td>
                  <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: cat.isActive ? '#d4edda' : '#fde8e8', color: cat.isActive ? 'var(--success)' : 'var(--error)' }}>{cat.isActive ? 'Aktif' : 'Pasif'}</span></td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-icon" onClick={() => handleEdit(cat)}><FiEdit2 /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(cat._id)}><FiTrash2 /></button>
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

export default Categories;
