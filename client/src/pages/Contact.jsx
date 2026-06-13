import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import api from '../services/api.js';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [form,    setForm]    = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      toast.success('Mesajınız iletildi!');
    } catch { toast.error('Mesaj gönderilemedi'); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page page-wrapper">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 className="section-title">İletişim</h1>
          <p className="section-subtitle">Sorularınız için buradayız</p>
          <div className="section-line" />
        </div>

        <div className="contact-layout">
          {/* Bilgiler */}
          <div className="contact-info">
            <h3>Bize Ulaşın</h3>
            <p>Ürünler, siparişler veya herhangi bir konuda yardımcı olmaktan mutluluk duyarız.</p>

            <div className="contact-items">
              {[
                { icon: <FiMapPin />, title: 'Adres', text: 'Konya, Türkiye' },
                { icon: <FiPhone />,  title: 'Telefon', text: '+90 500 123 45 67' },
                { icon: <FiMail />,   title: 'E-posta', text: 'info@cantadolusu.com' },
              ].map((item, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon">{item.icon}</div>
                  <div><strong>{item.title}</strong><p>{item.text}</p></div>
                </div>
              ))}
            </div>

            <div className="contact-hours">
              <h4>Çalışma Saatleri</h4>
              <p>Pazartesi – Cuma: 09:00 – 18:00</p>
              <p>Cumartesi: 10:00 – 15:00</p>
              <p>Pazar: Kapalı</p>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrapper">
            {sent ? (
              <div className="contact-success">
                <p style={{ fontSize: 52 }}>💌</p>
                <h3>Mesajınız İletildi!</h3>
                <p>En kısa sürede size dönüş yapacağız.</p>
                <button className="btn btn-outline" onClick={() => setSent(false)}>Yeni Mesaj Gönder</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group"><label>Ad Soyad</label><input className="form-control" value={form.name} onChange={set('name')} required /></div>
                  <div className="form-group"><label>E-posta</label><input className="form-control" type="email" value={form.email} onChange={set('email')} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Telefon <span>(isteğe bağlı)</span></label><input className="form-control" value={form.phone} onChange={set('phone')} /></div>
                  <div className="form-group"><label>Konu</label><input className="form-control" value={form.subject} onChange={set('subject')} /></div>
                </div>
                <div className="form-group"><label>Mesajınız</label><textarea className="form-control" rows={6} value={form.message} onChange={set('message')} required placeholder="Nasıl yardımcı olabiliriz?" /></div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  <FiSend /> {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
