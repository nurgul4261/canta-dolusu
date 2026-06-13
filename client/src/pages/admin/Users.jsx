import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error('Kendinizi silemezsiniz');
    if (!window.confirm('Bu kullanıcıyı silmek istiyor musunuz?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Kullanıcı silindi');
      fetchUsers();
    } catch {
      toast.error('Silme hatası');
    }
  };

  const handleToggleAdmin = async (u) => {
    if (u._id === currentUser._id) return toast.error('Kendi yetkinizi değiştiremezsiniz');
    try {
      await api.put(`/users/${u._id}`, { ...u, isAdmin: !u.isAdmin });
      toast.success('Yetki güncellendi');
      fetchUsers();
    } catch {
      toast.error('Güncelleme hatası');
    }
  };

  return (
    <AdminLayout title="Kullanıcı Yönetimi">
      {loading ? <div className="loading">Yükleniyor...</div> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Kayıt Tarihi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.isAdmin ? 'badge-primary' : 'badge-success'}`}>
                    {u.isAdmin ? '🛡️ Admin' : '👤 Kullanıcı'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="btn-outline"
                      onClick={() => handleToggleAdmin(u)}
                      disabled={u._id === currentUser._id}
                    >
                      {u.isAdmin ? 'Yetkiyi Al' : 'Admin Yap'}
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(u._id)}
                      disabled={u._id === currentUser._id}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
