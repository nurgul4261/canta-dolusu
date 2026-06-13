import { useState, useEffect } from "react";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";
import { toast } from "react-toastify";
import "./AdminCoupons.css";

export default function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discountPercent: 10,
    minQuantity: 20,
    expiresAt: "",
    usageLimit: "",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get("/coupons");
      setCoupons(data);
    } catch {
      toast.error("Kuponlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!form.code || !form.discountPercent)
      return toast.warn("Kod ve indirim oranı zorunlu");
    try {
      await api.post("/coupons", {
        ...form,
        discountPercent: Number(form.discountPercent),
        minQuantity: Number(form.minQuantity),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      });
      toast.success("Kupon oluşturuldu!");
      setForm({
        code: "",
        discountPercent: 10,
        minQuantity: 20,
        expiresAt: "",
        usageLimit: "",
      });
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Oluşturulamadı");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
      toast.success("Silindi");
    } catch {
      toast.error("Silinemedi");
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.patch(`/coupons/${id}/toggle`);
      setCoupons((prev) => prev.map((c) => (c._id === id ? data : c)));
    } catch {
      toast.error("Güncellenemedi");
    }
  };

  return (
    <AdminLayout title="🎟 Kupon Yönetimi">
      <div className="coupon-admin">
        <div className="coupon-form card">
          <h3>Yeni Kupon Oluştur</h3>
          <div className="coupon-fields">
            <div className="form-group">
              <label>Kupon Kodu</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="KOVAN10"
                style={{ textTransform: "uppercase" }}
              />
            </div>
            <div className="form-group">
              <label>İndirim (%)</label>
              <input
                name="discountPercent"
                type="number"
                min="1"
                max="100"
                value={form.discountPercent}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Min. Ürün Adedi</label>
              <input
                name="minQuantity"
                type="number"
                min="1"
                value={form.minQuantity}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Son Kullanma Tarihi</label>
              <input
                name="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Kullanım Limiti</label>
              <input
                name="usageLimit"
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={handleChange}
                placeholder="Sınırsız"
              />
            </div>
          </div>
          <button className="btn-primary" onClick={handleCreate}>
            + Kupon Oluştur
          </button>
        </div>

        <div className="coupon-list card">
          <h3>Mevcut Kuponlar</h3>
          {loading ? (
            <p className="loading-text">Yükleniyor...</p>
          ) : coupons.length === 0 ? (
            <p className="empty-text">Henüz kupon eklenmemiş.</p>
          ) : (
            <div className="coupon-table">
              <div className="coupon-thead">
                <span>Kod</span>
                <span>İndirim</span>
                <span>Min. Adet</span>
                <span>Kullanım</span>
                <span>Son Tarih</span>
                <span>Durum</span>
                <span></span>
              </div>
              {coupons.map((c) => (
                <div className="coupon-row" key={c._id}>
                  <span className="coupon-code">{c.code}</span>
                  <span>%{c.discountPercent}</span>
                  <span>{c.minQuantity} adet</span>
                  <span>
                    {c.usageCount}/{c.usageLimit ?? "∞"}
                  </span>
                  <span>
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString("tr-TR")
                      : "—"}
                  </span>
                  <span>
                    <button
                      className={`toggle-btn ${c.isActive ? "active" : "passive"}`}
                      onClick={() => handleToggle(c._id)}
                    >
                      {c.isActive ? "Aktif" : "Pasif"}
                    </button>
                  </span>
                  <span>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(c._id)}
                    >
                      🗑
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
