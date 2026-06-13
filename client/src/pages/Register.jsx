import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import './Login.css';

const Register = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Şifreler eşleşmiyor');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Hoş geldiniz! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız');
    } finally { setLoading(false); }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Çanta Dolusu <span>✦</span></Link>
          <h1>Üye Ol</h1>
          <p>Yeni hesap oluşturarak alışverişe başla</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Ad Soyad</label>
            <input className="form-control" placeholder="Adınız Soyadınız" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input className="form-control" type="email" placeholder="ornek@mail.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Telefon <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(isteğe bağlı)</span></label>
            <input className="form-control" type="tel" placeholder="0500 000 00 00" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input className="form-control" type="password" placeholder="En az 6 karakter" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input className="form-control" type="password" placeholder="Şifrenizi tekrar girin" value={form.confirm} onChange={set('confirm')} required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? 'Kayıt yapılıyor...' : 'Üye Ol'}
          </button>
        </form>

        <p className="auth-switch">
          Zaten hesabın var mı? <Link to="/giris">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
