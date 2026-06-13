import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import PrivateRoute from './components/ui/PrivateRoute.jsx';
import AdminRoute  from './components/ui/AdminRoute.jsx';

// Pages
import Home          from './pages/Home.jsx';
import Products      from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart          from './pages/Cart.jsx';
import Checkout      from './pages/Checkout.jsx';
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';
import Profile       from './pages/Profile.jsx';
import Contact       from './pages/Contact.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword  from './pages/ResetPassword.jsx';

// Admin
import AdminLayout   from './pages/admin/AdminLayout.jsx';
import Dashboard     from './pages/admin/Dashboard.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminOrders   from './pages/admin/Orders.jsx';
import AdminUsers    from './pages/admin/Users.jsx';
import Categories    from './pages/admin/Categories.jsx';
import AdminCoupons  from './pages/admin/AdminCoupons.jsx';
import UpsellPage    from './pages/admin/UpsellPage.jsx';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/urunler"             element={<Products />} />
            <Route path="/urunler/:slug"       element={<ProductDetail />} />
            <Route path="/sepet"               element={<Cart />} />
            <Route path="/giris"               element={<Login />} />
            <Route path="/kayit"               element={<Register />} />
            <Route path="/iletisim"            element={<Contact />} />
            <Route path="/sifremi-unuttum"     element={<ForgotPassword />} />
            <Route path="/sifre-sifirla/:token" element={<ResetPassword />} />

            <Route path="/odeme" element={
              <PrivateRoute><Checkout /></PrivateRoute>
            } />
            <Route path="/profil" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute><AdminLayout /></AdminRoute>
            }>
              <Route index           element={<Dashboard />} />
              <Route path="urunler"  element={<AdminProducts />} />
              <Route path="siparisler" element={<AdminOrders />} />
              <Route path="kullanicilar" element={<AdminUsers />} />
              <Route path="kategoriler"  element={<Categories />} />
              <Route path="kuponlar"     element={<AdminCoupons />} />
              <Route path="upsell"       element={<UpsellPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
