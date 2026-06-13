import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import toast from "react-hot-toast";
import { FiPackage, FiMapPin, FiUser, FiPlus, FiTrash2 } from "react-icons/fi";
import "./Profile.css";

const statusMap = {
  pending: { label: "Beklemede", color: "#C9A84C" },
  processing: { label: "Hazırlanıyor", color: "#4A90D9" },
  shipped: { label: "Kargoda", color: "#7B68EE" },
  delivered: { label: "Teslim Edildi", color: "#6B8C5A" },
  cancelled: { label: "İptal", color: "#C0392B" },
};

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "siparisler";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: "",
    confirm: "",
  });
  const [addrForm, setAddrForm] = useState({
    title: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    neighborhood: "",
    addressLine: "",
    zipCode: "",
    isDefault: false,
  });
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tab === "siparisler") {
      api
        .get("/orders/my")
        .then((r) => setOrders(r.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [tab]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (profileForm.password && profileForm.password !== profileForm.confirm)
      return toast.error("Şifreler eşleşmiyor");
    setSaving(true);
    try {
      const payload = { name: profileForm.name, phone: profileForm.phone };
      if (profileForm.password) payload.password = profileForm.password;
      const { data } = await api.put("/users/profile", payload);
      updateUser(data);
      toast.success("Profil güncellendi");
      setProfileForm((f) => ({ ...f, password: "", confirm: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Hata");
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/addresses", addrForm);
      updateUser({ addresses: data });
      toast.success("Adres eklendi");
      setShowAddrForm(false);
      setAddrForm({
        title: "",
        fullName: "",
        phone: "",
        city: "",
        district: "",
        neighborhood: "",
        addressLine: "",
        zipCode: "",
        isDefault: false,
      });
    } catch (err) {
      toast.error("Adres eklenemedi");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const { data } = await api.delete(`/users/addresses/${id}`);
      updateUser({ addresses: data });
      toast.success("Adres silindi");
    } catch {
      toast.error("Hata");
    }
  };

  const setP = (k) => (e) =>
    setProfileForm((f) => ({ ...f, [k]: e.target.value }));
  const setA = (k) => (e) =>
    setAddrForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="avatar-name">{user?.name}</p>
                <p className="avatar-email">{user?.email}</p>
              </div>
            </div>
            <nav className="profile-nav">
              {[
                {
                  key: "siparisler",
                  label: "Siparişlerim",
                  icon: <FiPackage />,
                },
                { key: "adresler", label: "Adreslerim", icon: <FiMapPin /> },
                { key: "bilgiler", label: "Bilgilerimi", icon: <FiUser /> },
              ].map((item) => (
                <button
                  key={item.key}
                  className={`profile-nav-item${tab === item.key ? " active" : ""}`}
                  onClick={() => setSearchParams({ tab: item.key })}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <button className="profile-nav-item logout" onClick={logout}>
                {" "}
                Çıkış Yap
              </button>
            </nav>
          </div>

          {/* İçerik */}
          <div className="profile-content">
            {/* Siparişler */}
            {tab === "siparisler" && (
              <div>
                <h2>Siparişlerim</h2>
                {loading ? (
                  <div className="spinner" />
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <h3>Henüz sipariş yok</h3>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div>
                            <p className="order-number">#{order.orderNumber}</p>
                            <p className="order-date">
                              {new Date(order.createdAt).toLocaleDateString(
                                "tr-TR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <span
                            className="order-status"
                            style={{
                              background: statusMap[order.status]?.color + "20",
                              color: statusMap[order.status]?.color,
                            }}
                          >
                            {statusMap[order.status]?.label}
                          </span>
                        </div>
                        <div className="order-items">
                          {order.items.map((item, i) => (
                            <div key={i} className="order-item">
                              <img
                                src={item.image || item.product?.images?.[0]}
                                alt={item.name}
                              />
                              <div>
                                <p>{item.name}</p>
                                <span>x{item.quantity}</span>
                              </div>
                              <span>
                                ₺
                                {(item.price * item.quantity).toLocaleString(
                                  "tr-TR",
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="order-footer">
                          {order.trackingNumber && (
                            <span>
                              Takip: <strong>{order.trackingNumber}</strong>
                            </span>
                          )}
                          <span className="order-total">
                            Toplam:{" "}
                            <strong>
                              ₺{order.totalPrice.toLocaleString("tr-TR")}
                            </strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Adresler */}
            {tab === "adresler" && (
              <div>
                <div className="content-header">
                  <h2>Adreslerim</h2>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowAddrForm((p) => !p)}
                  >
                    <FiPlus /> Yeni Adres
                  </button>
                </div>

                {showAddrForm && (
                  <form onSubmit={handleAddAddress} className="addr-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Adres Başlığı</label>
                        <input
                          className="form-control"
                          placeholder="Ev, İş..."
                          value={addrForm.title}
                          onChange={setA("title")}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Ad Soyad</label>
                        <input
                          className="form-control"
                          value={addrForm.fullName}
                          onChange={setA("fullName")}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Telefon</label>
                        <input
                          className="form-control"
                          value={addrForm.phone}
                          onChange={setA("phone")}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>İl</label>
                        <input
                          className="form-control"
                          value={addrForm.city}
                          onChange={setA("city")}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>İlçe</label>
                        <input
                          className="form-control"
                          value={addrForm.district}
                          onChange={setA("district")}
                          required
                        />
                      </div>
                      <div className="form-group span-2">
                        <label>Açık Adres</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={addrForm.addressLine}
                          onChange={setA("addressLine")}
                          required
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <button type="submit" className="btn btn-primary">
                        Kaydet
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setShowAddrForm(false)}
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                )}

                <div className="addresses-grid">
                  {user?.addresses?.map((addr) => (
                    <div
                      key={addr._id}
                      className={`addr-card${addr.isDefault ? " default" : ""}`}
                    >
                      <div className="addr-card-header">
                        <strong>{addr.title}</strong>
                        {addr.isDefault && (
                          <span className="default-badge">Varsayılan</span>
                        )}
                      </div>
                      <p>{addr.fullName}</p>
                      <p>{addr.phone}</p>
                      <p>{addr.addressLine}</p>
                      <p>
                        {addr.district} / {addr.city}
                      </p>
                      <button
                        className="addr-delete-btn"
                        onClick={() => handleDeleteAddress(addr._id)}
                      >
                        <FiTrash2 /> Sil
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bilgiler */}
            {tab === "bilgiler" && (
              <div>
                <h2>Bilgilerimi Düzenle</h2>
                <form onSubmit={handleProfileSave} className="profile-form">
                  <div className="form-group">
                    <label>Ad Soyad</label>
                    <input
                      className="form-control"
                      value={profileForm.name}
                      onChange={setP("name")}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>E-posta</label>
                    <input
                      className="form-control"
                      value={user?.email}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      className="form-control"
                      value={profileForm.phone}
                      onChange={setP("phone")}
                    />
                  </div>
                  <hr className="divider" />
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      marginBottom: 12,
                    }}
                  >
                    Şifrenizi değiştirmek istemiyorsanız boş bırakın.
                  </p>
                  <div className="form-group">
                    <label>Yeni Şifre</label>
                    <input
                      className="form-control"
                      type="password"
                      value={profileForm.password}
                      onChange={setP("password")}
                      placeholder="En az 6 karakter"
                    />
                  </div>
                  <div className="form-group">
                    <label>Yeni Şifre Tekrar</label>
                    <input
                      className="form-control"
                      type="password"
                      value={profileForm.confirm}
                      onChange={setP("confirm")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
