import { useState, useEffect } from 'react';
import { FiTrash2, FiShield } from 'react-icons/fi';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const Users = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users${search ? `?search=${search}` : ''}`);
      setUsers(data.users);
    } catch { toast.error('Yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`${user.name} kullanıcısını ${newRole === 'admin' ? 'admin yap' : 'adminlikten çıkar'}?`)) return;
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      toast.success('Rol güncellendi');
      fetchUsers();
    } catch { toast.error('Hata'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    try { await api.delete(`/users/${id}`); toast.success('Silindi'); fetchUsers(); }
    catch { toast.error('Silinemedi'); }
  };

  return (
    <div>
      <h1 className="admin-page-title">Kullanıcılar</h1>

      <div style={{ marginBottom: 20, maxWidth: 320 }}>
        <input className="form-control" placeholder="Ad veya e-posta ara..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'auto' }}>
        {loading ? <div className="spinner" style={{ margin: 40 }} /> : (
          <table className="admin-table">
            <thead><tr><th>Ad</th><th>E-posta</th><th>Telefon</th><th>Rol</th><th>Kayıt Tarihi</th><th>İşlem</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{u.phone || '—'}</td>
                  <td>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 600,
                      background: u.role === 'admin' ? 'rgba(201,168,76,0.15)' : 'var(--cream)',
                      color: u.role === 'admin' ? 'var(--gold-dark)' : 'var(--text-muted)' }}>
                      {u.role === 'admin' ? '★ Admin' : 'Üye'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn-icon" title={u.role === 'admin' ? 'Adminliği kaldır' : 'Admin yap'} onClick={() => handleRoleToggle(u)}><FiShield /></button>
                      <button className="btn-icon danger" onClick={() => handleDelete(u._id)}><FiTrash2 /></button>
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

export default Users;
