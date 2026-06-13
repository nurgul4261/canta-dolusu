import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  FiGrid,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiTag,
  FiPercent,
  FiTrendingUp,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import "./AdminLayout.css";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/admin/urunler", label: "Ürünler", icon: <FiShoppingBag /> },
  { to: "/admin/siparisler", label: "Siparişler", icon: <FiPackage /> },
  { to: "/admin/kullanicilar", label: "Kullanıcılar", icon: <FiUsers /> },
  { to: "/admin/kategoriler", label: "Kategoriler", icon: <FiTag /> },
  { to: "/admin/kuponlar", label: "Kuponlar", icon: <FiPercent /> },
  { to: "/admin/upsell", label: "Upsell", icon: <FiTrendingUp /> },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="admin-brand">
          <span>Çanta Dolusu</span>
          <small>Admin Panel</small>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-item${isActive ? " active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="admin-logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <FiLogOut /> Çıkış Yap
        </button>
      </aside>

      {/* Ana içerik */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((p) => !p)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <NavLink to="/" className="admin-home-link">
            ← Siteye Dön
          </NavLink>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminLayout;
