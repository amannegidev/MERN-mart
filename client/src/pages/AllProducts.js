import React, { useEffect, useState } from 'react';
import Layout from '../components/layouts/Layout';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useCart();

 const getAllProducts = async () => {
  try {
    const res = await fetch("/api/v1/products/get-product");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    setProducts(data.products); 
  } catch (err) {
    console.error("Error fetching products:", err);
    toast.error("Failed to load products");
  }
};

  useEffect(() => {
    getAllProducts();
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item added to cart");
  };

  return (
<Layout>
  <div className="w-full px-4 py-8">
    <h1 className="mb-6 text-3xl font-bold text-center sm:text-left">All Products</h1>

    {products.length === 0 ? (
      <p className="text-center text-gray-600">No products found</p>
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <Link to={`/products/${product.slug}`}>
              <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">
                <img
                  src={`/api/v1/products/product-photo/${product._id}`}
                  alt={product.name}
                  className="h-full w-full object-contain p-3"
                />
              </div>
            </Link>

            <div className="flex flex-1 flex-col justify-between p-4">
              <div className="">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <span className="text-sm hidden md:block font-semibold text-gray-700">
                    ₹{product.price.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
              </div>
             <div className='flex gap-2 align-middle justify-center items-center'>
                <span className="text-sm block md:hidden font-semibold text-gray-700">
                    ₹{product.price.toFixed(2)}
                  </span>
              <button
                onClick={() => addToCart(product)}
                className="w-full rounded-md bg-green-600 py-2  text-sm font-medium text-white transition hover:bg-green-700"
              >
                Add 
              </button>
             </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</Layout>




  );
};

export default AllProducts;
