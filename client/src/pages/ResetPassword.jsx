import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import './Login.css';

const ResetPassword = () => {
  const { token }  = useParams();
  const navigate   = useNavigate();
  const [form,    setForm]    = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Şifreler eşleşmiyor');
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Şifreniz güncellendi');
      navigate('/giris');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hata oluştu');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Çanta Dolusu <span>✦</span></Link>
          <h1>Yeni Şifre</h1>
          <p>Yeni şifrenizi belirleyin</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Yeni Şifre</label>
            <input className="form-control" type="password" placeholder="En az 6 karakter" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input className="form-control" type="password" placeholder="Şifrenizi tekrar girin" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
