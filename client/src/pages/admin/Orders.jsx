import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

const statusOptions = ['pending','processing','shipped','delivered','cancelled'];
const statusLabels  = { pending: 'Beklemede', processing: 'Hazırlanıyor', shipped: 'Kargoda', delivered: 'Teslim Edildi', cancelled: 'İptal' };
const statusColors  = { pending: '#C9A84C', processing: '#4A90D9', shipped: '#7B68EE', delivered: '#6B8C5A', cancelled: '#C0392B' };

const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders${filter ? `?status=${filter}` : ''}`);
      setOrders(data.orders);
    } catch { toast.error('Siparişler yüklenemedi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusUpdate = async (id, status, trackingNumber) => {
    try {
      await api.put(`/orders/${id}/status`, { status, trackingNumber });
      toast.success('Durum güncellendi');
      fetchOrders();
    } catch { toast.error('Hata'); }
  };

  return (
    <div>
      <h1 className="admin-page-title">Siparişler</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className={`chip${!filter ? ' active' : ''}`} onClick={() => setFilter('')}>Tümü</button>
        {statusOptions.map(s => <button key={s} className={`chip${filter === s ? ' active' : ''}`} onClick={() => setFilter(s)}>{statusLabels[s]}</button>)}
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="spinner" style={{ margin: 40 }} /> : (
          <table className="admin-table">
            <thead><tr><th>Sipariş No</th><th>Müşteri</th><th>Tutar</th><th>Durum</th><th>Tarih</th><th>İşlem</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <>
                  <tr key={o._id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                    <td><strong>#{o.orderNumber}</strong></td>
                    <td>{o.user?.name}<br /><span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.user?.email}</span></td>
                    <td>₺{o.totalPrice.toLocaleString('tr-TR')}</td>
                    <td>
                      <select
                        value={o.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleStatusUpdate(o._id, e.target.value)}
                        style={{ fontSize: 12, padding: '4px 8px', borderRadius: 4, border: `1.5px solid ${statusColors[o.status]}`, color: statusColors[o.status], background: statusColors[o.status] + '15', fontWeight: 600 }}
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                      </select>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>{expanded === o._id ? '▲' : '▼'}</td>
                  </tr>
                  {expanded === o._id && (
                    <tr>
                      <td colSpan={6} style={{ background: 'var(--cream)', padding: 20 }}>
                        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                          <div>
                            <strong style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Ürünler</strong>
                            {o.items.map((item, i) => (
                              <p key={i} style={{ fontSize: 13, marginTop: 6 }}>{item.name} x{item.quantity} — ₺{(item.price * item.quantity).toLocaleString('tr-TR')}</p>
                            ))}
                          </div>
                          <div>
                            <strong style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Adres</strong>
                            <p style={{ fontSize: 13, marginTop: 6, lineHeight: 1.7 }}>
                              {o.shippingAddress?.fullName}<br />
                              {o.shippingAddress?.addressLine}<br />
                              {o.shippingAddress?.district} / {o.shippingAddress?.city}
                            </p>
                          </div>
                          <div>
                            <strong style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Kargo Takip</strong>
                            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                              <input className="form-control" style={{ width: 180, fontSize: 13 }} placeholder="Takip numarası" defaultValue={o.trackingNumber || ''} id={`track-${o._id}`} />
                              <button className="btn btn-dark btn-sm" onClick={() => handleStatusUpdate(o._id, o.status, document.getElementById(`track-${o._id}`).value)}>Kaydet</button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
