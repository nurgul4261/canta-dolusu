import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form,      setForm]      = useState({ email: '', password: '' });
  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Hoş geldiniz!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">Çanta Dolusu <span>✦</span></Link>
          <h1>Giriş Yap</h1>
          <p>Hesabına giriş yaparak alışverişe devam et</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>E-posta</label>
            <input className="form-control" type="email" placeholder="ornek@mail.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label>Şifre</label>
            <div className="pass-wrapper">
              <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="Şifreniz" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(p => !p)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="auth-forgot">
            <Link to="/sifremi-unuttum">Şifremi unuttum</Link>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-switch">
          Hesabın yok mu? <Link to="/kayit">Üye ol</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
