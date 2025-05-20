import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import { useCart } from '../context/cart'; // Make sure this path is correct
import { toast } from 'react-hot-toast';
import { AiOutlineReload } from 'react-icons/ai';

const CategoryProductPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const {cart, setCart} = useCart();

  // Get total products in category (for "Load More")
  const getTotal = async () => {
    try {
      const { data } = await axios.get(`/api/v1/products/category-count/${slug}`);
      if (data.success) {
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error fetching total count", error);
    }
  };

  // Fetch paginated products
  const getProductsByCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/products/category/${slug}?page=${page}`);
      if (data.success) {
        setProducts((prev) => (page === 1 ? data.products : [...prev, ...data.products]));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 on category change
  }, [slug]);

  useEffect(() => {
    getProductsByCategory();
    getTotal();
  }, [slug, page]);

  return (
    <Layout>
      <div className="max-w-screen-xl sm:px-6 lg:px-8 py-10">
        <div className="mb-8 ">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            Products in <span className="text-blue-600">{slug}</span> category
          </h2>
          <p className="text-sm text-gray-500 mt-2">Explore items listed under this category</p>
        </div>

        {products.length > 0 ? (
          <div className=" rounded w-full ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition duration-300"
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
                  <div className="p-4 space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                      <span className="text-sm font-bold text-gray-800">
                        ${p.price?.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {p.description?.substring(0, 45)}...
                    </p>
                    <div className="pt-2">
                      <button
                        className="text-sm bg-green-200 text-green-950 px-4 py-1.5 rounded-md hover:bg-green-950 hover:text-white transition w-full"
                        onClick={() => {
                          const existingItem = cart.find(item => item._id === p._id);
                          const updatedCart = existingItem
                            ? cart.map(item =>
                                item._id === p._id
                                  ? { ...item, quantity: item.quantity + 1 }
                                  : item
                              )
                            : [...cart, { ...p, quantity: 1 }];
                          setCart(updatedCart);
                          localStorage.setItem("cart", JSON.stringify(updatedCart));
                          toast.success("Item added to cart");
                        }}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {products.length < total && (
              <div className="mt-8 flex justify-center">
                <button
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : <>Load More <AiOutlineReload /></>}
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg mt-10">No products available in this category.</p>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProductPage;
