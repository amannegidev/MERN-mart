import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Policy from "./pages/Policy";
import Register from "./pages/Register";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/User/UserDashboard";
import AdminRoute from "./components/routes/AdminRoutes";
import PrivateRoute from "./components/routes/PrivateRoute";
import CreateCategory from "./pages/Admin/createCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Products from "./pages/Admin/Product";
import UpdateProduct from "./pages/Admin/UpdateProducts";
import Profile from "./pages/User/Profile";
import CartPage from "./pages/CartPage";
import Orders from "./pages/User/Order";
import ProductPage from "./pages/ProductPage";
import CategoryProductsPage from "./pages/CategoryProductPage";
import SearchResults from "./pages/SearchResults";
import AdminOrders from "./pages/Admin/AdminOrders";
import AllProducts from "./pages/AllProducts";


function App() {
  return (
   <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/PageNotFound" element={<PageNotFound />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpass" element={<ForgotPass />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/category/:slug" element={<CategoryProductsPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/products" element={<AllProducts />} />

      {/* Admin Route */}
      <Route path="/dashboard" element={<AdminRoute />}>
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="create-category" element={<CreateCategory />} />
        <Route path="create-products" element={<CreateProduct />} />
        <Route path="products" element={<Products />} />
        <Route path="/dashboard/admin/products/:slug" element={<UpdateProduct />}/>
        <Route path="orders" element={<AdminOrders />} />



      </Route>

      {/* User Route */}
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="user" element={<UserDashboard />} />
        <Route path="/dashboard/user/profile" element={<Profile />} />
        <Route path="/dashboard/user/orders" element={<Orders />} />

      </Route>



    </Routes>
    <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
   </>

  );
}

export default App;
