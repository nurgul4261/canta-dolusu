import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Çanta Dolusu</span>
          <span className="logo-sub">✦</span>
        </Link>

        {/* Masaüstü linkler */}
        <ul className="navbar-links">
          <li><NavLink to="/">Ana Sayfa</NavLink></li>
          <li><NavLink to="/urunler">Koleksiyon</NavLink></li>
          <li><NavLink to="/urunler?featured=true">Öne Çıkanlar</NavLink></li>
          <li><NavLink to="/iletisim">İletişim</NavLink></li>
        </ul>

        {/* Sağ aksiyonlar */}
        <div className="navbar-actions">
          {/* Sepet */}
          <Link to="/sepet" className="action-btn cart-btn">
            <FiShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* Kullanıcı */}
          {user ? (
            <div className="user-menu-wrapper">
              <button className="action-btn" onClick={() => setUserMenuOpen(p => !p)}>
                <FiUser size={20} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <p className="user-name">{user.name}</p>
                  <Link to="/profil"   onClick={() => setUserMenuOpen(false)}><FiUser size={14} /> Profilim</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setUserMenuOpen(false)}><FiSettings size={14} /> Admin Panel</Link>}
                  <button onClick={handleLogout}><FiLogOut size={14} /> Çıkış Yap</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/giris" className="btn btn-outline btn-sm">Giriş Yap</Link>
          )}

          {/* Mobil hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobil menü */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/"                      onClick={() => setMenuOpen(false)}>Ana Sayfa</NavLink>
          <NavLink to="/urunler"               onClick={() => setMenuOpen(false)}>Koleksiyon</NavLink>
          <NavLink to="/urunler?featured=true" onClick={() => setMenuOpen(false)}>Öne Çıkanlar</NavLink>
          <NavLink to="/iletisim"              onClick={() => setMenuOpen(false)}>İletişim</NavLink>
          <NavLink to="/sepet"                 onClick={() => setMenuOpen(false)}>Sepet ({totalItems})</NavLink>
          {user ? (
            <>
              <NavLink to="/profil" onClick={() => setMenuOpen(false)}>Profilim</NavLink>
              {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Çıkış Yap</button>
            </>
          ) : (
            <NavLink to="/giris" onClick={() => setMenuOpen(false)}>Giriş Yap</NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
