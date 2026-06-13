import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext.jsx';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  const price         = product.discountPrice || product.price;
  const hasDiscount   = product.discountPrice && product.discountPrice < product.price;
  const discountPct   = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : null;

  return (
    <div className="product-card">
      {/* Görsel */}
      <Link to={`/urunler/${product.slug}`} className="card-image-wrapper">
        <img
          src={product.images?.[0] || '/placeholder.jpg'}
          alt={product.name}
          className="card-image"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="card-discount-badge">-%{discountPct}</span>
        )}
        {product.isFeatured && !hasDiscount && (
          <span className="card-featured-badge">✦ Öne Çıkan</span>
        )}

        {/* Hover overlay */}
        <div className="card-overlay">
          <button
            className="overlay-btn"
            onClick={e => { e.preventDefault(); addItem(product); }}
          >
            <FiShoppingBag size={16} /> Sepete Ekle
          </button>
        </div>
      </Link>

      {/* Bilgi */}
      <div className="card-body">
        {product.category?.name && (
          <span className="card-category">{product.category.name}</span>
        )}
        <Link to={`/urunler/${product.slug}`}>
          <h3 className="card-name">{product.name}</h3>
        </Link>

        {/* Renkler */}
        {product.colors?.length > 0 && (
          <div className="card-colors">
            {product.colors.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="color-dot"
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="color-more">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        {/* Puan */}
        {product.ratings?.count > 0 && (
          <div className="card-rating">
            <span className="stars">{'★'.repeat(Math.round(product.ratings.average))}{'☆'.repeat(5 - Math.round(product.ratings.average))}</span>
            <span className="rating-count">({product.ratings.count})</span>
          </div>
        )}

        {/* Fiyat */}
        <div className="card-price">
          <span className="price-current">₺{price.toLocaleString('tr-TR')}</span>
          {hasDiscount && (
            <span className="price-original">₺{product.price.toLocaleString('tr-TR')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
