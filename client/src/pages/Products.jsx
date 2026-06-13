import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import api from '../services/api.js';
import ProductCard from '../components/ui/ProductCard.jsx';
import './Products.css';

const sortOptions = [
  { value: 'newest',     label: 'En Yeni' },
  { value: 'price-asc',  label: 'Fiyat: Düşük → Yüksek' },
  { value: 'price-desc', label: 'Fiyat: Yüksek → Düşük' },
  { value: 'popular',    label: 'En Çok Değerlendirilen' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const page     = Number(searchParams.get('page'))     || 1;
  const search   = searchParams.get('search')           || '';
  const category = searchParams.get('category')         || '';
  const sort     = searchParams.get('sort')             || 'newest';
  const minPrice = searchParams.get('minPrice')         || '';
  const maxPrice = searchParams.get('maxPrice')         || '';
  const featured = searchParams.get('featured')         || '';

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (search)   params.search   = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (featured) params.featured = featured;
        if (category) {
          const cat = categories.find(c => c.slug === category);
          if (cat) params.category = cat._id;
        }
        const { data } = await api.get('/products', { params });
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, categories]);

  const clearFilters = () => setSearchParams({});

  const hasFilter = search || category || minPrice || maxPrice || featured;

  return (
    <div className="products-page page-wrapper">
      <div className="container">

        {/* Başlık */}
        <div className="products-header">
          <div>
            <h1 className="section-title" style={{ textAlign: 'left' }}>
              {featured ? 'Öne Çıkan Ürünler' : category ? categories.find(c => c.slug === category)?.name || 'Koleksiyon' : 'Tüm Ürünler'}
            </h1>
            <p className="products-count">{total} ürün bulundu</p>
          </div>
          <div className="products-toolbar">
            <button className="filter-toggle-btn" onClick={() => setFilterOpen(p => !p)}>
              <FiFilter /> Filtrele {filterOpen ? <FiChevronDown style={{ transform: 'rotate(180deg)' }} /> : <FiChevronDown />}
            </button>
            <select className="sort-select form-control" value={sort} onChange={e => setParam('sort', e.target.value)}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filtre paneli */}
        {filterOpen && (
          <div className="filter-panel">
            {/* Arama */}
            <div className="filter-group">
              <label>Ara</label>
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  className="form-control"
                  placeholder="Ürün adı, marka..."
                  value={search}
                  onChange={e => setParam('search', e.target.value)}
                />
                {search && <button className="search-clear" onClick={() => setParam('search', '')}><FiX /></button>}
              </div>
            </div>

            {/* Kategori */}
            <div className="filter-group">
              <label>Kategori</label>
              <div className="filter-chips">
                <button className={`chip${!category ? ' active' : ''}`} onClick={() => setParam('category', '')}>Tümü</button>
                {categories.map(c => (
                  <button key={c._id} className={`chip${category === c.slug ? ' active' : ''}`} onClick={() => setParam('category', c.slug)}>
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Fiyat */}
            <div className="filter-group">
              <label>Fiyat Aralığı</label>
              <div className="price-inputs">
                <input className="form-control" type="number" placeholder="Min ₺" value={minPrice} onChange={e => setParam('minPrice', e.target.value)} />
                <span>—</span>
                <input className="form-control" type="number" placeholder="Max ₺" value={maxPrice} onChange={e => setParam('maxPrice', e.target.value)} />
              </div>
            </div>

            {hasFilter && (
              <button className="btn btn-outline btn-sm" onClick={clearFilters}><FiX /> Filtreleri Temizle</button>
            )}
          </div>
        )}

        {/* Ürünler */}
        {loading ? (
          <div className="spinner" />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>Ürün bulunamadı</h3>
            <p>Farklı filtreler deneyebilirsin.</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={clearFilters}>Filtreleri Temizle</button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`page-btn${n === page ? ' active' : ''}`}
                onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', n); setSearchParams(p); }}
              >
                {n}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
