import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Price";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../components/layouts/Layout";
import { useCart } from "../context/cart";
import { AiOutlineReload } from "react-icons/ai";
import Hero from "../components/HeroSection";

const HomePage = () => {
  /* ───────── state ───────── */
  const { cart, setCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [coldDrinkProducts, setColdDrinkProducts] = useState([]);
  const [vegieProducts, setVegieProducts] = useState([]);

  /* NEW: show / hide filter sidebar on mobile  */
  const [showFilters, setShowFilters] = useState(false);

  /* ───────── helpers ───────── */
  const fetchProductsByCategorySlug = async (slug) => {
    try {
      const { data } = await axios.get(`/api/v1/products/category/${slug}`);
      return data?.success ? data.products : [];
    } catch (err) {
      console.error(`Failed to fetch ${slug}`, err);
      return [];
    }
  };

  /* initial carousels */
  useEffect(() => {
    fetchProductsByCategorySlug("cold-drinks").then(setColdDrinkProducts);
    fetchProductsByCategorySlug("vegies").then(setVegieProducts);
  }, []);

  /* categories   */
  useEffect(() => {
    const getAllCategory = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-category");
        if (data?.success) setCategories(data.category);
      } catch (err) {
        console.log(err);
      }
    };
    getAllCategory();
  }, []);

  /* products list & count */
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/product-list/${page}`);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/product-count");
      setTotal(data.total);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAllProducts();
    getTotal();
  }, []);

  /* pagination “load more” */
  useEffect(() => {
    if (page === 1) return;
    const loadMore = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/v1/products/product-list/${page}`);
        setProducts((prev) => [...prev, ...data.products]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    loadMore();
  }, [page]);

  /* filter logic */
  const handleFilter = (val, id) => {
    const all = val ? [...checked, id] : checked.filter((c) => c !== id);
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (!checked.length && !radio.length) return;
    const filterProduct = async () => {
      try {
        const { data } = await axios.post("/api/v1/products/product-filters", {
          checked,
          radio,
        });
        setProducts(data.products);
      } catch (err) {
        console.log(err);
      }
    };
    filterProduct();
  }, [checked, radio]);

  /* ───────── UI ───────── */
  return (
    <Layout title="All Products - Best Offers">
      <div className="w-full flex flex-col gap-6 px-4 py-4 lg:px-12 bg-white">
        {/* ───── Hero ───── */}
        <div className="w-full rounded-xl overflow-hidden">
          <Hero />
        </div>

        {/* ───── Cold Drinks Carousel ───── */}
        {coldDrinkProducts.length > 0 && (
          <div className="mt-5 mb-1">
            <Link
              to="/category/cold-drinks"
              className="no-underline text-xl capitalize font-semibold text-black"
            >
              cold&nbsp;-&nbsp;drinks
            </Link>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2 mt-3 sm:px-0">
              {coldDrinkProducts.map((p) => (
                <div
                  key={p._id}
                  className="min-w-[60vw] sm:min-w-[250px] bg-white rounded-xl border border-gray-200 hover:shadow-md transition flex-shrink-0"
                >
                  <Link to={`/products/${p.slug}`} className="no-underline">
                    <div className="bg-gray-50 flex items-center justify-center h-40 rounded-t-xl overflow-hidden">
                      <img
                        src={`/api/v1/products/product-photo/${p._id}`}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />
                    </div>
                  </Link>
                  <div className="p-4 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="text-lg text-gray-800">{p.name}</h3>
                      <span className="text-lg font-semibold text-gray-800">
                        ₹{p.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {p.description.substring(0, 45)}...
                    </p>
                    <button
                      className="text-sm bg-green-200 text-green-950 px-4 py-2 mt-1 rounded-md hover:bg-green-950 hover:text-white transition w-full"
                      onClick={() => {
                        const existing = cart.find((i) => i._id === p._id);
                        const updated = existing
                          ? cart.map((i) =>
                            i._id === p._id
                              ? { ...i, quantity: i.quantity + 1 }
                              : i
                          )
                          : [
                            ...cart,
                            {
                              _id: p._id,
                              name: p.name,
                              price: p.price,
                              quantity: 1,
                              description: p.description,
                            },
                          ];
                        setCart(updated);
                        localStorage.setItem("cart", JSON.stringify(updated));
                        toast.success("Item added to cart");
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───── Vegies Carousel ───── */}
        {vegieProducts.length > 0 && (
          <div className="mt-1 mb-3">
            <Link
              to="/category/vegies"
              className="no-underline text-xl capitalize font-semibold text-black"
            >
              Vegetables
            </Link>
            <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2 mt-3 sm:px-0">
              {vegieProducts.map((p) => (
                <div
                  key={p._id}
                  className="min-w-[60vw] sm:min-w-[250px] bg-white rounded-xl border border-gray-200 hover:shadow-md transition flex-shrink-0"
                >
                  <Link to={`/products/${p.slug}`} className="no-underline">
                    <div className="bg-gray-50 flex items-center justify-center h-40 rounded-t-xl overflow-hidden">
                      <img
                        src={`/api/v1/products/product-photo/${p._id}`}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />
                    </div>
                  </Link>
                  <div className="p-4 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="text-lg text-gray-800">{p.name}</h3>
                      <span className="text-lg font-semibold text-gray-800">
                        ₹{p.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {p.description.substring(0, 45)}...
                    </p>
                    <button
                      className="text-sm bg-green-200 text-green-950 px-4 py-2 mt-1 rounded-md hover:bg-green-950 hover:text-white transition w-full"
                      onClick={() => {
                        const existing = cart.find((i) => i._id === p._id);
                        const updated = existing
                          ? cart.map((i) =>
                            i._id === p._id
                              ? { ...i, quantity: i.quantity + 1 }
                              : i
                          )
                          : [
                            ...cart,
                            {
                              _id: p._id,
                              name: p.name,
                              price: p.price,
                              quantity: 1,
                              description: p.description,
                            },
                          ];
                        setCart(updated);
                        localStorage.setItem("cart", JSON.stringify(updated));
                        toast.success("Item added to cart");
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {/* backdrop when sidebar open */}
        {showFilters && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-30"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* ───── Filters + Products  ───── */}
        <div className="flex justify-between">
          <Link
            to="/products"
            className="no-underline text-xl capitalize font-semibold text-black"
          >
            all products
          </Link>

          {/* ───── mobile “Filters” button ───── */}

          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden   bg-red-500 text-white px-4 py-2 "
          >
            Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-2 ">

          {/* ───────── Filter Sidebar ───────── */}
          <div
            className={`
              lg:col-span-2 col-span-12 bg-gray-200 rounded p-6 border border-green-700 shadow-sm
              lg:static lg:block
              fixed top-0 left-0 h-full  max-w-xs overflow-y-auto z-40
              transform transition-transform duration-300
              ${showFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            {/* close × (mobile only) */}
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden text-green-800 text-2xl absolute top-3 right-4"
              aria-label="Close filters"
            >
              &times;
            </button>

            <h4 className="text-xl font-bold text-green-800 mt-2 lg:mt-0">
              Filter by Category
            </h4>
            <hr />
            <div className="flex flex-col gap-3 mb-8">
              {categories.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                  className="text-green-800 mb-1"
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>

            <h4 className="text-xl font-bold text-green-800">Filter by Price</h4>
            <hr />
            <div className="flex flex-col gap-3 mb-6">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices.map((p) => (
                  <div key={p._id} className="flex items-center gap-2 mb-2">
                    <Radio value={p.array} className="text-green-700" />
                    <span className="text-sm text-gray-700">{p.name}</span>
                  </div>
                ))}
              </Radio.Group>
            </div>

            <button
              className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-2"
              onClick={() => window.location.reload()}
            >
              Reset Filters
            </button>
          </div>

          {/* ───────── Product Section ───────── */}

          {/* ───── Product Section ───── */}
          <div className="lg:col-span-10 col-span-12 p-3 rounded bg-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl border border-gray-200 transition"
                >
                  <Link to={`/products/${p.slug}`}>
                    <div className="bg-gray-50 flex items-center justify-center h-40 rounded-t-xl overflow-hidden">
                      <img
                        src={`/api/v1/products/product-photo/${p._id}`}
                        alt={p.name}
                        className="h-full object-contain p-2"
                      />
                    </div>
                  </Link>

                  <div className="p-2 md:p-4 space-y-1">
                    <div className="flex justify-between items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                      <span className="text-sm font-bold text-gray-800">
                       ₹{p.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs hidden md:block text-gray-500">
                      {p.description.substring(0, 45)}...
                    </p>

                    <button
                      className="mt-2 text-sm bg-green-200 text-green-950 px-4 py-1.5 rounded-md hover:bg-green-950 hover:text-white transition w-full"
                      onClick={() => {
                        const existing = cart.find((i) => i._id === p._id);
                        const updated = existing
                          ? cart.map((i) =>
                            i._id === p._id
                              ? { ...i, quantity: i.quantity + 1 }
                              : i
                          )
                          : [...cart, { ...p, quantity: 1 }];
                        setCart(updated);
                        localStorage.setItem("cart", JSON.stringify(updated));
                        toast.success("Item added to cart");
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load-more button */}
            <div className="mt-8 flex justify-center">
              {products.length < total && (
                <button
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : <>Load More <AiOutlineReload /></>}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
