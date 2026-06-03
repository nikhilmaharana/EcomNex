import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FaCheck, FaClipboardList, FaStore, FaTimes, FaUsers } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../Footer";
import { apiUrl, getAuthHeaders, getProductImage, normalizeProduct } from "../lib/api";
import { UserContext } from "../context/UserContext";

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const sellerDisplayName = (seller) =>
  seller.businessName || seller.name || seller.email || "Seller";

const productStatus = (product) => product.approvalStatus || "pending";

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

const AdminPage = () => {
  const { user: currentUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [activeProductStatus, setActiveProductStatus] = useState("pending");
  const [rejectionReasons, setRejectionReasons] = useState({});
  const [productRejectionReasons, setProductRejectionReasons] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");

  const authError =
    currentUser?.role !== "admin"
      ? "Please login as admin to view this page."
      : "";

  const loadAdminData = useCallback(async () => {
    if (authError) return;

    setLoading(true);
    setError("");

    try {
      const [userData, sellerData, productData, orderData] = await Promise.all([
        fetchJson(apiUrl("/auth/users"), { headers: getAuthHeaders() }),
        fetchJson(apiUrl("/admin/sellers"), { headers: getAuthHeaders() }),
        fetchJson(apiUrl("/admin/products"), { headers: getAuthHeaders() }),
        fetchJson(apiUrl("/orders"), { headers: getAuthHeaders() }),
      ]);

      setUsers(Array.isArray(userData) ? userData : []);
      setSellers(Array.isArray(sellerData) ? sellerData : []);
      setProducts(Array.isArray(productData) ? productData.map(normalizeProduct) : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authError]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAdminData();
  }, [loadAdminData]);

  const sellerCounts = useMemo(
    () =>
      sellers.reduce(
        (counts, seller) => {
          const status = seller.sellerStatus || (seller.sellerApproved ? "approved" : "pending");
          counts[status] = (counts[status] || 0) + 1;
          return counts;
        },
        { pending: 0, approved: 0, rejected: 0 }
      ),
    [sellers]
  );

  const filteredSellers = sellers.filter((seller) => {
    const status = seller.sellerStatus || (seller.sellerApproved ? "approved" : "pending");
    return status === activeStatus;
  });

  const productCounts = useMemo(
    () =>
      products.reduce(
        (counts, product) => {
          const status = productStatus(product);
          counts[status] = (counts[status] || 0) + 1;
          return counts;
        },
        { pending: 0, approved: 0, rejected: 0 }
      ),
    [products]
  );

  const filteredProducts = products.filter(
    (product) => productStatus(product) === activeProductStatus
  );

  const handleApprove = async (sellerId) => {
    setActionId(sellerId);
    setError("");
    setMessage("");

    try {
      const data = await fetchJson(apiUrl(`/admin/sellers/${sellerId}/approve`), {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      setSellers((current) =>
        current.map((seller) => (seller._id === sellerId ? data.user : seller))
      );
      setMessage(data.message || "Seller approved");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  const handleReject = async (sellerId) => {
    const reason = (rejectionReasons[sellerId] || "").trim();
    if (!reason) {
      setError("Write a rejection review before rejecting this seller.");
      return;
    }

    setActionId(sellerId);
    setError("");
    setMessage("");

    try {
      const data = await fetchJson(apiUrl(`/admin/sellers/${sellerId}/reject`), {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      setSellers((current) =>
        current.map((seller) => (seller._id === sellerId ? data.user : seller))
      );
      setRejectionReasons((current) => ({ ...current, [sellerId]: "" }));
      setMessage(data.message || "Seller rejected");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  const handleApproveProduct = async (productId) => {
    setActionId(productId);
    setError("");
    setMessage("");

    try {
      const data = await fetchJson(apiUrl(`/admin/products/${productId}/approve`), {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      setProducts((current) =>
        current.map((product) =>
          product._id === productId ? normalizeProduct(data.product) : product
        )
      );
      setMessage(data.message || "Product approved");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  const handleRejectProduct = async (productId) => {
    const reason = (productRejectionReasons[productId] || "").trim();
    if (!reason) {
      setError("Write a product rejection review before rejecting it.");
      return;
    }

    setActionId(productId);
    setError("");
    setMessage("");

    try {
      const data = await fetchJson(apiUrl(`/admin/products/${productId}/reject`), {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });

      setProducts((current) =>
        current.map((product) =>
          product._id === productId ? normalizeProduct(data.product) : product
        )
      );
      setProductRejectionReasons((current) => ({ ...current, [productId]: "" }));
      setMessage(data.message || "Product rejected");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050816] text-white px-4 py-24 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-300">
                Admin control
              </p>
              <h1 className="text-3xl font-bold">Seller Approval Panel</h1>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
              {currentUser?.email}
            </div>
          </div>

          {(authError || error || message) && (
            <div
              className={`rounded-lg border p-4 text-sm ${
                error || authError
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {authError || error || message}
            </div>
          )}

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <FaUsers className="mb-4 text-2xl text-purple-300" />
              <p className="text-sm text-gray-400">Total users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <FaStore className="mb-4 text-2xl text-cyan-300" />
              <p className="text-sm text-gray-400">Pending sellers</p>
              <p className="text-3xl font-bold">{sellerCounts.pending}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <FaCheck className="mb-4 text-2xl text-emerald-300" />
              <p className="text-sm text-gray-400">Pending products</p>
              <p className="text-3xl font-bold">{productCounts.pending}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <FaClipboardList className="mb-4 text-2xl text-amber-300" />
              <p className="text-sm text-gray-400">Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Product Approval</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveProductStatus(status)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      activeProductStatus === status
                        ? "bg-cyan-600 text-white"
                        : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {label} ({productCounts[status] || 0})
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="rounded-lg border border-white/10 bg-[#111827] p-6 text-gray-300">
                Loading product approvals...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-[#111827] p-6 text-gray-300">
                No {statusLabels[activeProductStatus].toLowerCase()} products.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredProducts.map((product) => {
                  const status = productStatus(product);
                  const seller = product.seller || {};

                  return (
                    <article
                      key={product._id}
                      className="rounded-lg border border-white/10 bg-[#111827] p-5"
                    >
                      <div className="flex gap-4">
                        <img
                          src={getProductImage(product)}
                          alt={product.title}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h3 className="font-semibold">{product.title}</h3>
                              <p className="text-sm text-gray-400">
                                {seller.businessName || seller.name || product.sellerName || "Seller"}
                              </p>
                            </div>
                            <span className="w-fit rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
                              {statusLabels[status] || status}
                            </span>
                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-gray-300 sm:grid-cols-3">
                            <p>₹{product.price}</p>
                            <p>Stock: {product.stock || 0}</p>
                            <p>{product.category || "General"}</p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm text-gray-400">
                        {product.description || "No description provided."}
                      </p>

                      {status === "rejected" && (
                        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                          <p className="font-semibold">Admin review</p>
                          <p className="mt-1 text-red-100/90">
                            {product.rejectionReason || "No reason saved."}
                          </p>
                        </div>
                      )}

                      {status === "pending" && (
                        <div className="mt-5 space-y-3">
                          <textarea
                            value={productRejectionReasons[product._id] || ""}
                            onChange={(event) =>
                              setProductRejectionReasons((current) => ({
                                ...current,
                                [product._id]: event.target.value,
                              }))
                            }
                            placeholder="Review reason if this product is rejected"
                            className="min-h-24 w-full resize-y rounded-lg border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                          />
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => handleApproveProduct(product._id)}
                              disabled={actionId === product._id}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectProduct(product._id)}
                              disabled={actionId === product._id}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Seller Requests</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setActiveStatus(status)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      activeStatus === status
                        ? "bg-purple-600 text-white"
                        : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {label} ({sellerCounts[status] || 0})
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="rounded-lg border border-white/10 bg-[#111827] p-6 text-gray-300">
                Loading admin data...
              </div>
            ) : filteredSellers.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-[#111827] p-6 text-gray-300">
                No {statusLabels[activeStatus].toLowerCase()} seller requests.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredSellers.map((seller) => {
                  const status =
                    seller.sellerStatus || (seller.sellerApproved ? "approved" : "pending");

                  return (
                    <article
                      key={seller._id}
                      className="rounded-lg border border-white/10 bg-[#111827] p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{sellerDisplayName(seller)}</h3>
                          <p className="text-sm text-gray-400">{seller.email}</p>
                        </div>
                        <span className="w-fit rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
                          {statusLabels[status] || status}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-gray-300 sm:grid-cols-2">
                        <p>Phone: {seller.phone || "Not provided"}</p>
                        <p>GST: {seller.gst || "Not provided"}</p>
                        <p>Joined: {new Date(seller.createdAt).toLocaleDateString()}</p>
                        <p>Approved: {seller.sellerApproved ? "Yes" : "No"}</p>
                      </div>

                      {status === "rejected" && (
                        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                          <p className="font-semibold">Admin review</p>
                          <p className="mt-1 text-red-100/90">
                            {seller.rejectionReason || "No reason saved."}
                          </p>
                        </div>
                      )}

                      {status === "pending" && (
                        <div className="mt-5 space-y-3">
                          <textarea
                            value={rejectionReasons[seller._id] || ""}
                            onChange={(event) =>
                              setRejectionReasons((current) => ({
                                ...current,
                                [seller._id]: event.target.value,
                              }))
                            }
                            placeholder="Review reason if this seller is rejected"
                            className="min-h-24 w-full resize-y rounded-lg border border-white/10 bg-[#0b1120] px-4 py-3 text-sm text-white outline-none focus:border-purple-400"
                          />
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              type="button"
                              onClick={() => handleApprove(seller._id)}
                              disabled={actionId === seller._id}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(seller._id)}
                              disabled={actionId === seller._id}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AdminPage;
