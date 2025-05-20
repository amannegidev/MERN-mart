import React, { useEffect, useState } from 'react';
import Layout from '../../components/layouts/Layout';
import UserMenu from "../../components/layouts/UserMenu";
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/orders');
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout title="Your Orders">
      <div className="min-h-screen bg-white py-4 px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="text-white rounded-2xl">
              <UserMenu />
            </div>
          </aside>

          {/* Orders Section */}
          <main className="lg:col-span-3 space-y-8">
            {orders.length === 0 ? (
              <div className="text-center text-gray-500 text-lg bg-gray-50 py-12 rounded-2xl shadow-sm border">
                You haven’t placed any orders yet.
              </div>
            ) : (
              orders.map((order, i) => (
                <section
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  {/* Order Header */}
                  <header className="flex flex-col gap-3 border-b bg-indigo-50 px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* left block */}
                    <div>
                      <h2 className="text-base font-bold text-indigo-700 sm:text-lg">
                        Order #{i + 1}
                      </h2>
                      <p className="text-xs text-gray-600 sm:text-sm">
                        Placed on&nbsp;{moment(order.createdAt).format("MMMM D, YYYY")}
                      </p>
                    </div>

                    {/* badge row — nowrap + scroll */}
                    <div className="flex flex-nowrap items-center gap-2 ">
                      <span className="whitespace-nowrap rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700 sm:text-sm">
                        {order?.buyer?.name}
                      </span>

                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium sm:text-sm ${order.payment.success
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {order.payment.success ? "Payment Success" : "Payment Failed"}
                      </span>

                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs sm:text-sm ${order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {order.status}
                      </span>

                      <span className="ml-auto whitespace-nowrap text-xs text-gray-500 sm:text-sm">
                        {order.products.length} Product
                        {order.products.length > 1 && "s"}
                      </span>
                    </div>
                  </header>


                  {/* Order Products */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 bg-gray-50">
                    {order.products.map(({ product, quantity }, idx) => (
                      <div
                        key={product?._id || `unknown-${idx}`}
                        className="flex gap-4 bg-white p-4 rounded-xl border border-gray-200 "
                      >
                        {product ? (
                          <>
                            <img
                              src={`/api/v1/products/product-photo/${product._id}`}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded-lg border"
                            />
                            <div className="flex flex-col justify-between">
                              <div>
                                <h3 className="font-semibold text-gray-800 text-base">
                                  {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {product.description?.substring(0, 60)}...
                                </p>
                              </div>
                              <p className="text-indigo-600 font-semibold ">
                                ₹{product.price} × {quantity} = ₹{product.price * quantity}
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-red-500 text-sm">Product details not available (might be deleted).</div>
                        )}
                      </div>
                    ))}

                  </div>
                </section>
              ))
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
