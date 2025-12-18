import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import CustomerDashboard from './pages/CustomerDashboard';
import DashboardPage from './pages/dashboard/DashboardPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Admin Pages
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminWorkers from './pages/admin/Workers';

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Customer Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/main" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/orders" element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/products" element={
                  <ProtectedRoute>
                    <AdminProducts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute>
                    <AdminOrders />
                  </ProtectedRoute>
                } />
                <Route path="/admin/customers" element={
                  <ProtectedRoute>
                    <AdminCustomers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/workers" element={
                  <ProtectedRoute>
                    <AdminWorkers />
                  </ProtectedRoute>
                } />

                {/* Worker Routes */}
                <Route path="/worker/dashboard" element={
                  <ProtectedRoute>
                    <WorkerDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
