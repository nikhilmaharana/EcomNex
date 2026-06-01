import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../Footer";
import { UserContext } from "../context/UserContext";
import { apiUrl, getProductImage, normalizeProduct } from "../lib/api";

const OrdersPage = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?._id) return;

    fetch(apiUrl(`/orders?buyerId=${user._id}`))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load your orders");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?._id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050816] px-4 py-24 text-white">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">My Orders</h1>
            <p className="mt-2 text-gray-400">
              Track products you have placed from this buyer account.
            </p>
          </div>

          {loading && <p className="text-gray-400">Loading orders...</p>}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
              {error}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-[#111827] p-8 text-center text-gray-300">
              No orders yet.
            </div>
          )}

          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order._id}
                className="rounded-xl border border-white/10 bg-[#111827] p-5"
              >
                <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <h2 className="font-semibold text-purple-200">{order._id}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
                      {order.status}
                    </span>
                    <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-300">
                      {order.paymentStatus}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-gray-200">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  {order.items.map((item) => {
                    const product = normalizeProduct(item.product || {});
                    return (
                      <div key={item.product?._id || item.title} className="flex gap-4">
                        <img
                          src={getProductImage(product)}
                          alt={item.title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-gray-400">
                            Sold by {item.seller?.businessName || item.seller?.name || "Seller"}
                          </p>
                          <p className="text-sm text-purple-300">
                            ₹{item.price} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OrdersPage;
