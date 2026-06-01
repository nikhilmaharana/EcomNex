import { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../Footer";
import { apiUrl, getProductImage, normalizeProduct, getAuthHeaders } from "../lib/api";
import { UserContext } from "../context/UserContext";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const { user: currentUser } = useContext(UserContext);
  const authError =
    currentUser?.role !== "admin"
      ? "Please login as admin to view this page."
      : "";

  useEffect(() => {
    if (authError) return;

    Promise.all([
      fetch(apiUrl("/auth/users"), { headers: getAuthHeaders() }).then((res) => res.json()),
      fetch(apiUrl("/products")).then((res) => res.json()),
      fetch(apiUrl("/orders"), { headers: getAuthHeaders() }).then((res) => res.json()),
    ])
      .then(([userData, productData, orderData]) => {
        setUsers(userData);
        setProducts(productData.map(normalizeProduct));
        setOrders(orderData);
      })
      .catch((err) => setError(err.message));
  }, [authError]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#020617] text-white px-6 py-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          {(authError || error) && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              {authError || error}
            </div>
          )}

          <section className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#111827] rounded-xl p-5 border border-white/10">
              <p className="text-gray-400">Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="bg-[#111827] rounded-xl p-5 border border-white/10">
              <p className="text-gray-400">Products</p>
              <p className="text-3xl font-bold">{products.length}</p>
            </div>
            <div className="bg-[#111827] rounded-xl p-5 border border-white/10">
              <p className="text-gray-400">Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
          </section>

          <section className="bg-[#111827] rounded-xl p-5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {users.map((user) => (
                <div key={user._id} className="bg-black/20 rounded-lg p-3">
                  <p className="font-semibold">{user.name || user.businessName || "User"}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-sm text-cyan-300">{user.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#111827] rounded-xl p-5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product._id} className="bg-black/20 rounded-lg p-3">
                  <img
                    src={getProductImage(product)}
                    alt={product.title}
                    className="h-28 w-full object-cover rounded-lg mb-3"
                  />
                  <p className="font-semibold line-clamp-1">{product.title}</p>
                  <p className="text-sm text-gray-400">₹{product.price}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#111827] rounded-xl p-5 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="bg-black/20 rounded-lg p-3">
                  <p className="font-semibold">Order {order._id}</p>
                  <p className="text-sm text-gray-400">
                    {order.buyer?.email} · ₹{order.total} · {order.status}
                  </p>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-400">No orders yet.</p>}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminPage;
