import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import UserPage from "./pages/User";
import Favorites from "./pages/Favorites";
import ResetPassword from "./pages/ResetPassword";

import MainLayout from "./components/layout/MainLayout";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminProductEdit from "./pages/admin/AdminProductEdit";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            AUTH
            Không Header / Footer
        ========================= */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        {/* =========================
            WEBSITE
            Có Header + Footer
        ========================= */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />

          <Route path="/products/:id" element={<ProductDetail />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/user" element={<UserPage />} />

          <Route path="/favorites" element={<Favorites />} />
        </Route>

        <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="products" element={<AdminProducts />} />

            <Route path="products/create" element={<AdminProductForm />} />

            <Route
              path="/admin/products/edit/:id"
              element={<AdminProductEdit />}
            />

            <Route path="/admin/categories" element={<AdminCategories />} />

            <Route
              path="/admin/categories/create"
              element={<AdminCategoryForm />}
            />

            <Route
              path="/admin/categories/edit/:id"
              element={<AdminCategoryForm />}
            />

            <Route path="/admin/orders" element={<AdminOrders />} />

            <Route path="customers" element={<AdminUsers />} />

            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
