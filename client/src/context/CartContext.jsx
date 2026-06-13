import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem('cantaDolusuCart') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('cantaDolusuCart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, selectedColor = null) => {
    setItems(prev => {
      const key = `${product._id}-${selectedColor}`;
      const exists = prev.find(i => `${i._id}-${i.selectedColor}` === key);
      if (exists) {
        toast.success('Adet güncellendi');
        return prev.map(i =>
          `${i._id}-${i.selectedColor}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      toast.success('Sepete eklendi 🛍️');
      return [...prev, { ...product, quantity, selectedColor }];
    });
  };

  const removeItem = (id, selectedColor) => {
    setItems(prev => prev.filter(i => !(i._id === id && i.selectedColor === selectedColor)));
  };

  const updateQty = (id, selectedColor, quantity) => {
    if (quantity < 1) return removeItem(id, selectedColor);
    setItems(prev =>
      prev.map(i => i._id === id && i.selectedColor === selectedColor ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = items.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
