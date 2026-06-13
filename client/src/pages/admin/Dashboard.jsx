import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import api from "../../services/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/orders?limit=5"),
      api.get("/products?limit=1"),
      api.get("/users?limit=1"),
    ])
      .then(([ordersRes, productsRes, usersRes]) => {
        const orders = ordersRes.data;
        const revenue =
          orders.orders?.reduce((s, o) => s + o.totalPrice, 0) || 0;
        setStats({
          orders: orders.total || 0,
          products: productsRes.data.total || 0,
          users: usersRes.data.total || 0,
          revenue,
        });
        setRecentOrders(orders.orders || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    pending: "#C9A84C",
    processing: "#4A90D9",
    shipped: "#7B68EE",
    delivered: "#6B8C5A",
    cancelled: "#C0392B",
  };
  const statusLabels = {
    pending: "Beklemede",
    processing: "Hazırlanıyor",
    shipped: "Kargoda",
    delivered: "Teslim Edildi",
    cancelled: "İptal",
  };

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "Toplam Sipariş",
            value: stats.orders,
            icon: <FiPackage />,
            color: "#4A90D9",
          },
          {
            label: "Toplam Ürün",
            value: stats.products,
            icon: <FiShoppingBag />,
            color: "#C9A84C",
          },
          {
            label: "Toplam Üye",
            value: stats.users,
            icon: <FiUsers />,
            color: "#7B68EE",
          },
          {
            label: "Toplam Ciro",
            value: `₺${stats.revenue.toLocaleString("tr-TR")}`,
            icon: <FiTrendingUp />,
            color: "#6B8C5A",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="admin-card"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: s.color + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.color,
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--brown)",
                  fontFamily: "var(--font-serif)",
                }}
              >
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3 style={{ fontSize: 16, color: "var(--brown)" }}>
            Son Siparişler
          </h3>
          <Link
            to="/admin/siparisler"
            style={{ fontSize: 13, color: "var(--gold)" }}
          >
            Tümünü Gör →
          </Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sipariş No</th>
                <th>Müşteri</th>
                <th>Toplam</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <strong>#{o.orderNumber}</strong>
                  </td>
                  <td>{o.user?.name}</td>
                  <td>₺{o.totalPrice.toLocaleString("tr-TR")}</td>
                  <td>
                    <span
                      style={{
                        background: statusColors[o.status] + "20",
                        color: statusColors[o.status],
                        padding: "3px 10px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {statusLabels[o.status]}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>
                    {new Date(o.createdAt).toLocaleDateString("tr-TR")}
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

export default Dashboard;
