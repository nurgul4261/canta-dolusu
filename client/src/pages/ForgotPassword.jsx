import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import './Login.css';

const ForgotPassword = () => {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Sıfırlama bağlantısı gönderildi');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hata oluştu');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Çanta Dolusu <span>✦</span></Link>
          <h1>Şifremi Unuttum</h1>
          <p>E-posta adresinize sıfırlama bağlantısı göndereceğiz</p>
        </div>
        {sent ? (
          <div style={{ textAlign: 'center', color: 'var(--success)', padding: '20px 0' }}>
            <p style={{ fontSize: 40 }}>✉️</p>
            <p style={{ marginTop: 12 }}>E-postanızı kontrol edin!</p>
            <Link to="/giris" className="btn btn-outline" style={{ marginTop: 20 }}>Giriş Yap</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>E-posta</label>
              <input className="form-control" type="email" placeholder="ornek@mail.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
            </button>
          </form>
        )}
        <p className="auth-switch"><Link to="/giris">← Giriş sayfasına dön</Link></p>
      </div>
    </div>
  );
};
export default ForgotPassword;
