import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import Layout from "../components/layouts/Layout";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";

const SearchResults = () => {
  const { cart, setCart } = useCart();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) return;
      try {
        const response = await fetch(`/api/v1/products/search/${searchQuery}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  // Helper function to add product to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      : [
        ...cart,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          description: product.description,
        },
      ];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item added to cart");
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold  text-center mt-3 mb-5">
          Search Results for "{searchQuery}"
        </h1>

        {searchResults.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-10">
            No products found
          </p>
        ) : searchResults.length === 1 ? (
          // Single Product View
          <div className="max-w-6xl mx-auto px-4 py-10">
  <div className="bg-white shadow-md rounded-2xl overflow-hidden flex flex-col md:flex-row md:items-center gap-8 p-6 md:p-8">
    
    {/* Left: Product Image */}
    <div className="w-full md:w-1/2 flex justify-center items-center">
      <div className="aspect-[4/3] w-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        <img
          src={`/api/v1/products/product-photo/${searchResults[0]._id}`}
          alt={searchResults[0].name}
          className="h-full w-full object-contain p-4"
        />
      </div>
    </div>

    {/* Right: Product Details */}
    <div className="w-full md:w-1/2 flex flex-col justify-between gap-6">
      {/* Product Name, Description, Price */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {searchResults[0].name}
        </h2>
        <p className="text-gray-700 text-base sm:text-lg mb-4 leading-relaxed">
          {searchResults[0].description}
        </p>
        <p className="text-2xl sm:text-3xl font-semibold text-green-700">
          ₹{searchResults[0].price.toFixed(2)}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => addToCart(searchResults[0])}
          className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition"
        >
          Add to Cart
        </button>
          <Link
            to="/cart"
            className="flex-1 min-w-[140px] no-underline text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 px-4 rounded-lg transition"
          >
            Shop Now
          </Link>

      </div>

      {/* Extra Info */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
        Looking for more? Check out our latest arrivals and exclusive deals.
      </div>
    </div>
  </div>
</div>

        ) : (
          // Grid View for Multiple Matches
          <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {searchResults.map((product) => (
              <div
                key={product._id}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link to={`/products/${product.slug}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-50 flex items-center justify-center">
                    <img
                      src={`/api/v1/products/product-photo/${product._id}`}
                      alt={product.name}
                      className="h-full w-full object-contain p-3"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
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
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-sm block md:hidden font-semibold text-gray-700">
                     ₹{product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700"
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

export default SearchResults;
