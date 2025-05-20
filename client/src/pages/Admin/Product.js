import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layouts/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        `}
      >
        <AdminMenu />
      </aside>

      {/* main content */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          {/* hamburger button for mobile */}
        <button
        className="lg:hidden fixed top-4 lg:top-0  right-4 z-30 p-2 rounded-md bg-white "
        onClick={() => setSidebarOpen(true)}
      >
        <i className="bi bi-list text-2xl" />
      </button>

          <h1 className="text-lg sm:text-xl font-semibold uppercase">
            All Products List
          </h1>

          {/* Empty div to balance flex */}
          <div className="w-6 lg:hidden" />
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-12 py-8">
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {products.map((p) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/products/${p.slug}`}
                  className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 no-underline"
                >
                  <img
                    src={`/api/v1/products/product-photo/${p._id}`}
                    alt={p.name}
                    className="w-full h-48 object-contain p-3"
                  />
                  <div className="">
                    <h5 className="text-lg text-center font-medium text-gray-900">{p.name}</h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;
