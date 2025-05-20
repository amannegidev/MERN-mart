import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layouts/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import dropin from "braintree-web-drop-in";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const { cart, setCart } = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dropinRef = useRef(null); // for mounting Drop-in UI

  // Fetch Braintree client token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/products/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  //  Initialize Drop-in UI when clientToken is ready
  useEffect(() => {
    if (clientToken && dropinRef.current) {
      dropin.create(
        {
          authorization: clientToken,
          container: dropinRef.current,
          // paypal: { flow: "vault" },
        },
        (err, dropinInstance) => {
          if (err) {
            console.error("Dropin error:", err);
            return;
          }
          console.log("DropIn instance created:", dropinInstance);
          setInstance(dropinInstance);
        }
      );
    }
  }, [clientToken]);

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  // Calculate total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price * (item.quantity || 1);
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //  Remove item from cart
  const removeCartItem = (pid) => {
    try {
      const newCart = [...cart];
      const index = newCart.findIndex((item) => item._id === pid);
      newCart.splice(index, 1);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      console.log("Nonce received:", nonce);

      const { data } = await axios.post("/api/v1/products/braintree/payment", {
        nonce,
        cart,
      });



      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Payment Completed Successfully");

      setTimeout(() => {
        navigate("/dashboard/user/orders");
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error?.message || "Payment failed.");
      setLoading(false);
    }
  };

  const increaseQty = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const decreaseQty = (productId) => {
    const updatedCart = cart.map((item) => {
      if (item._id === productId && (item.quantity || 1) > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    console.log(cart); // Log the cart data to check for undefined or missing descriptions
  }, [cart]);



  return (
    <Layout>
      <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white border border-green-200 shadow-sm rounded-lg p-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-green-800">
              {!auth?.user ? "Hello, Guest" : `Hello, ${auth?.user?.name}`}
            </h1>
            <p className="text-gray-600 mt-2 text-base">
              {cart?.length
                ? `You have ${cart.length} item(s) in your cart ${auth?.token ? "" : "- please login to checkout."
                }`
                : "Your cart is currently empty."}
            </p>
          </div>

          {/* Cart Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cart?.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-md p-3 flex flex-col md:flex-row justify-between gap-6 hover:shadow-lg transition-all border border-green-100"
                >
                  {/* Product Info */}
                  <div className="flex gap-5 items-start">
                    <img
                      src={`/api/v1/products/product-photo/${p._id}`}
                      alt={p.name}
                      className="w-36 h-28 py-2 object-contain rounded-xl border border-green-100"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-green-900">{p.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {p.description?.substring(0, 60) ?? "No description available"}...
                      </p>

                      <p className="text-green-700 font-semibold mt-2 text-base">
                        ₹{p.price}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:items-end justify-between gap-3 md:text-right">
                    <div className="flex justify-evenly items-center gap-3">
                     <div className="">
                       <button
                        onClick={() => decreaseQty(p._id)}
                        className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-200"
                      >
                        −
                      </button>
                      <span className="text-base mx-3 font-medium">{p.quantity || 1}</span>
                      <button
                        onClick={() => increaseQty(p._id)}
                        className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-200"
                      >
                        +
                      </button>
                     </div>
                     <div className="block md:hidden">
                       <button
                      onClick={() => removeCartItem(p._id)}
                      className="bg-red-500 text-white px-12 py-2 rounded-md hover:bg-red-600 font-medium transition"
                    >
                      Remove
                    </button>
                     </div>
                    </div>
                    <button
                      onClick={() => removeCartItem(p._id)}
                      className="bg-red-500 hidden md:block text-white px-12 py-2 rounded-md hover:bg-red-600 font-medium transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>


            {/* Summary & Payment */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md border border-green-100">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Cart Summary</h2>
              <p className="text-sm text-gray-500 mb-2">Total | Checkout | Payment</p>
              <hr className="my-3 border-green-200" />
              <h4 className="text-lg font-bold text-green-900 mb-6">Total: {totalPrice()}</h4>

              {/* Address Section */}
              {auth?.user?.address ? (
                <div className="mb-6">
                  <h4 className="font-medium text-green-700">Current Address</h4>
                  <p className="text-sm text-gray-700">{auth.user.address}</p>
                  <button
                    onClick={() => navigate("/dashboard/profile")}
                    className="mt-2 text-sm text-green-700 hover:underline"
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  {auth?.token ? (
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="text-sm text-green-700 hover:underline"
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate("/login", { state: "/cart" })}
                      className="text-sm text-green-700 hover:underline"
                    >
                      Please login to checkout
                    </button>
                  )}
                </div>
              )}

              {/* Payment Section */}
              {clientToken && auth?.token && cart?.length > 0 && (
                <>
                  <div ref={dropinRef} className="my-4" />
                  <button
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                    className="mt-4 w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 disabled:opacity-50 transition font-medium"
                  >
                    {loading ? "Processing..." : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>

  );
};

export default CartPage;