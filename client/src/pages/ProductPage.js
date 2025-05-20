import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../components/layouts/Layout';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';


const ProductPage = () => {
    const {cart, setCart} = useCart();
  const { slug } = useParams(); // Get the slug from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const { data } = await axios.get(`/api/v1/products/get-product/${slug}`);
        if (data.success) {
          setProduct(data.product);
        } else {
          // Handle error if product is not found
          alert('Product not found');
        }
      } catch (err) {
        console.log(err);
        alert('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    getProductDetail();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
<Layout>
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {/* Breadcrumb */}
    <nav className="text-xs text-gray-500 mb-4">
      <span className="hover:text-gray-700 cursor-pointer">Home</span> /
      <span className="text-gray-700"> {product.name}</span>
    </nav>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="bg-white p-4 rounded-lg flex items-center justify-center shadow-sm">
        <img
          src={`/api/v1/products/product-photo/${product._id}`}
          alt={product.name}
          className="h-80 w-full object-contain rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between space-y-6">
        {/* Title and Brand */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
        </div>

        {/* Size and Price */}
        <div>
          <p className="text-sm text-gray-600">{product.size || '750 ml'}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${product.price}</p>
          <p className="text-xs text-gray-500 mt-1">(inclusive of all taxes)</p>
        </div>

        {/* Add to Cart */}
        <div>
          <button
            className="w-full bg-green-600 text-white text-sm py-3 rounded-md hover:bg-green-700 transition"
            onClick={() => {
              const existingItem = cart.find(item => item._id === product._id);
              let updatedCart;
              if (existingItem) {
                updatedCart = cart.map(item =>
                  item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
              } else {
                updatedCart = [...cart, { ...product, quantity: 1 }];
              }
              setCart(updatedCart);
              localStorage.setItem("cart", JSON.stringify(updatedCart));
              toast.success("Item added to cart");
            }}
          >
            Add to Cart
          </button>
        </div>

        {/* Why Shop With Us */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Why shop with us?</h3>
          <div className="space-y-3">
            {[
              {
                title: 'Superfast Delivery',
                desc: 'Get your order delivered from stores near you quickly.',
              },
              {
                title: 'Best Prices & Offers',
                desc: 'Offers directly from manufacturers at unbeatable prices.',
              },
              {
                title: 'Wide Assortment',
                desc: 'Choose from food, personal care, household, and more.',
              },
            ].map((item, idx) => (
              <div className="flex items-start gap-3" key={idx}>
                <div className="text-green-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</Layout>

  
  
  );
};


export default ProductPage;
