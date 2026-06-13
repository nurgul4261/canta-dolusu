import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        {/* Marka */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Çanta Dolusu <span>✦</span></Link>
          <p>Her kadının hayalindeki çantayı bulabileceği, özenle seçilmiş koleksiyonumuzla yanınızdayız.</p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FiInstagram /></a>
            <a href="https://facebook.com"  target="_blank" rel="noreferrer"><FiFacebook /></a>
            <a href="https://twitter.com"   target="_blank" rel="noreferrer"><FiTwitter /></a>
          </div>
        </div>

        {/* Koleksiyon */}
        <div className="footer-col">
          <h4>Koleksiyon</h4>
          <ul>
            <li><Link to="/urunler?category=kol-cantasi">Kol Çantaları</Link></li>
            <li><Link to="/urunler?category=capraz-canta">Çapraz Çantalar</Link></li>
            <li><Link to="/urunler?category=sirt-cantasi">Sırt Çantaları</Link></li>
            <li><Link to="/urunler?featured=true">Öne Çıkanlar</Link></li>
            <li><Link to="/urunler?sort=newest">Yeni Gelenler</Link></li>
          </ul>
        </div>

        {/* Hesabım */}
        <div className="footer-col">
          <h4>Hesabım</h4>
          <ul>
            <li><Link to="/giris">Giriş Yap</Link></li>
            <li><Link to="/kayit">Üye Ol</Link></li>
            <li><Link to="/profil">Siparişlerim</Link></li>
            <li><Link to="/profil">Adreslerim</Link></li>
            <li><Link to="/iletisim">Yardım</Link></li>
          </ul>
        </div>

        {/* İletişim */}
        <div className="footer-col">
          <h4>İletişim</h4>
          <ul className="footer-contact">
            <li><FiMapPin /> Konya, Türkiye</li>
            <li><FiPhone /> <a href="tel:+905001234567">+90 500 123 45 67</a></li>
            <li><FiMail /> <a href="mailto:info@cantadolusu.com">info@cantadolusu.com</a></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Çanta Dolusu. Tüm hakları saklıdır.</p>
          <div className="footer-payment">
            <span>Güvenli Ödeme</span>
            <span className="payment-badge">💳 Kredi Kartı</span>
            <span className="payment-badge">🏦 Havale</span>
            <span className="payment-badge">📦 Kapıda Ödeme</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
