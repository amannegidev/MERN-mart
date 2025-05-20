// src/pages/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import AdminMenu from "../../components/layouts/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminOrders = () => {
  /* ─────────────────── original logic (unchanged) ─────────────────── */
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const loadOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (err) {
      console.error("Could not load orders", err);
    }
  };

  useEffect(() => {
    if (auth?.token && auth?.user?.role === 1) loadOrders();
  }, [auth]);

  /* ───────────────  ─────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <AdminMenu />
      </aside>

      {/* main column */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          {/* hamburger */}
           <button
        className="lg:hidden fixed top-4 lg:top-0  right-4 z-30 p-2 rounded-md bg-white "
        onClick={() => setSidebarOpen(true)}
      >
        <i className="bi bi-list text-2xl" />
      </button>

          <h1 className="text-lg sm:text-xl font-semibold uppercase">
            All Orders
          </h1>

          {/* spacer to balance flex */}
          <div className="w-6 lg:hidden" />
        </header>

        {/* content */}
       <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-6 sm:py-8 space-y-10">
  {orders.length === 0 ? (
    <p className="text-center text-gray-500 italic">No orders yet.</p>
  ) : (
    orders.map((order, i) => (
      <section
        key={order._id}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
      >
        {/* ── header row ─────────────────────────── */}
        <div className="bg-indigo-50/60 backdrop-blur-sm px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-between">
          {/* order meta */}
          <div>
            <h2 className="font-semibold text-indigo-700">
              Order&nbsp;#{i + 1}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              {moment(order.createdAt).format("MMM D, YYYY · h:mm A")}
            </p>
          </div>

          {/* badges */}
          <div className="flex flex-wrap items-center gap-2 text-[13px] sm:text-sm">
            <span className="px-2.5 py-0.5 rounded bg-gray-200 text-gray-700">
              {order.buyer?.name || "Unknown buyer"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded ${
                order.payment.success
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.payment.success ? "Paid" : "Failed"}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
            <span className="text-gray-600 ml-1">
              {order.products.length}&nbsp;item
              {order.products.length > 1 && "s"}
            </span>
          </div>
        </div>

        {/* ── product grid ───────────────────────── */}
        <div className="bg-gray-50 px-5 sm:px-6 py-6">
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {order.products.map(({ product, quantity }, idx) => (
              <div
                key={product?._id || idx}
                className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4"
              >
                {product ? (
                  <>
                    <img
                      src={`/api/v1/products/product-photo/${product._id}`}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{product.name}</p>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        ₹{product.price} × {quantity}
                      </p>
                      <p className="text-indigo-600 font-semibold text-sm sm:text-base mt-1">
                        ₹{product.price * quantity}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500 text-sm">Product missing</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ))
  )}
</main>

      </div>
    </div>
  );
};

export default AdminOrders;
