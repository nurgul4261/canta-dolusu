import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';

const emptyForm = { name: '', description: '', image: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => { setEditCat(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (c) => { setEditCat(c); setForm({ name: c.name, description: c.description || '', image: c.image || '' }); setShowModal(true); };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) {
        await api.put(`/categories/${editCat._id}`, form);
        toast.success('Kategori güncellendi');
      } else {
        await api.post('/categories', form);
        toast.success('Kategori eklendi');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hata');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kategoriyi silmek istiyor musunuz?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori silindi');
      fetchCategories();
    } catch {
      toast.error('Silme hatası');
    }
  };

  return (
    <AdminLayout title="Kategori Yönetimi">
      <div className="admin-toolbar">
        <span>{categories.length} kategori</span>
        <button className="btn-primary" onClick={openCreate}>+ Yeni Kategori</button>
      </div>

      {loading ? <div className="loading">Yükleniyor...</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>Slug</th>
              <th>Açıklama</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: 'var(--text-light)', fontSize: 13 }}>{c.slug}</td>
                <td>{c.description || '-'}</td>
                <td>
                  <div className="admin-actions">
                    <button className="btn-primary" onClick={() => openEdit(c)}>Düzenle</button>
                    <button className="btn-danger" onClick={() => handleDelete(c._id)}>Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editCat ? 'Kategori Düzenle' : 'Yeni Kategori'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Kategori Adı</label><input name="name" value={form.name} onChange={handleChange} required /></div>
              <div className="form-group"><label>Açıklama</label><textarea name="description" value={form.description} onChange={handleChange} rows={2} /></div>
              <div className="form-group"><label>Görsel URL</label><input name="image" value={form.image} onChange={handleChange} /></div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="btn-primary">{editCat ? 'Güncelle' : 'Ekle'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
