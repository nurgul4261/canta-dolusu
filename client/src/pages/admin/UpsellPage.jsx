import { useState, useEffect } from "react";
import api from "../../services/api";
import AdminLayout from "./AdminLayout";
import { toast } from "react-toastify";
import "./UpsellPage.css";

export default function UpsellPage() {
  const [products, setProducts] = useState([]);
  const [mainProduct, setMainProduct] = useState("");
  const [suggestedProduct, setSuggestedProduct] = useState("");
  const [upsells, setUpsells] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/products?pageSize=1000")
      .then((r) => setProducts(r.data.products || r.data))
      .catch(() => toast.error("Ürünler yüklenemedi"));
  }, []);

  useEffect(() => {
    if (!mainProduct) return setUpsells([]);
    setLoading(true);
    api
      .get(`/upsell/admin/${mainProduct}`)
      .then((r) => setUpsells(r.data))
      .catch(() => toast.error("Upsell'ler yüklenemedi"))
      .finally(() => setLoading(false));
  }, [mainProduct]);

  const handleAdd = async () => {
    if (!mainProduct || !suggestedProduct)
      return toast.warn("Lütfen iki ürün de seçin");
    if (mainProduct === suggestedProduct)
      return toast.warn("Aynı ürünü seçemezsiniz");
    try {
      await api.post("/upsell/admin", {
        main_product_id: mainProduct,
        suggested_product_id: suggestedProduct,
      });
      toast.success("Eklendi!");
      setSuggestedProduct("");
      const r = await api.get(`/upsell/admin/${mainProduct}`);
      setUpsells(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Eklenemedi");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/upsell/admin/${id}`);
      setUpsells((prev) => prev.filter((u) => u._id !== id));
      toast.success("Silindi");
    } catch {
      toast.error("Silinemedi");
    }
  };

  return (
    <AdminLayout title="🎁 Kasa Önü Ürünleri">
      <div className="upsell-admin">
        <div className="upsell-form card">
          <h3>Yeni Öneri Ekle</h3>
          <div className="upsell-selects">
            <div className="form-group">
              <label>Ana Ürün (sepete eklenince...)</label>
              <select
                value={mainProduct}
                onChange={(e) => setMainProduct(e.target.value)}
              >
                <option value="">— Ürün seçin —</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <span className="upsell-arrow">→</span>
            <div className="form-group">
              <label>Önerilecek Ürün</label>
              <select
                value={suggestedProduct}
                onChange={(e) => setSuggestedProduct(e.target.value)}
              >
                <option value="">— Ürün seçin —</option>
                {products
                  .filter((p) => p._id !== mainProduct)
                  .map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={handleAdd}>
            + Ekle
          </button>
        </div>

        {mainProduct && (
          <div className="upsell-list card">
            <h3>
              Mevcut Öneriler —{" "}
              <em>{products.find((p) => p._id === mainProduct)?.name}</em>
            </h3>
            {loading ? (
              <p className="loading-text">Yükleniyor...</p>
            ) : upsells.length === 0 ? (
              <p className="empty-text">Henüz öneri eklenmemiş.</p>
            ) : (
              <div className="upsell-table">
                {upsells.map((u, i) => (
                  <div className="upsell-row" key={u._id}>
                    <span className="upsell-order">#{i + 1}</span>
                    <img
                      src={u.suggestedProduct.image || "/placeholder.png"}
                      alt={u.suggestedProduct.name}
                      className="upsell-thumb"
                    />
                    <span className="upsell-name">
                      {u.suggestedProduct.name}
                    </span>
                    <span className="upsell-price">
                      {Number(u.suggestedProduct.price).toFixed(2)} ₺
                    </span>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(u._id)}
                    >
                      🗑 Sil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
