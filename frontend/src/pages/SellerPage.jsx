import React, { useState, useEffect, useContext, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../Footer";
import { apiUrl, getProductImage, normalizeProduct, readImageFile, getAuthHeaders } from "../lib/api";
import { UserContext } from "../context/UserContext";

const SellerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openSidebar, setOpenSidebar] = useState(false);

  const [product, setProduct] = useState({
    title: "",
    price: "",
    images: [],
    description: "",
    category: "",
    stock: "",
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { user: currentUser } = useContext(UserContext);
  const authError =
    !currentUser?._id || currentUser.role !== "seller"
      ? "Please login as a seller to manage products."
      : "";

  const productStatusLabel = (item) => {
    const status = item.approvalStatus || "pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const fetchSellerData = useCallback(async () => {
    try {
      const [productRes, orderRes] = await Promise.all([
        fetch(apiUrl(`/products?sellerId=${currentUser._id}`), {
          headers: getAuthHeaders(),
        }),
        fetch(apiUrl(`/orders?sellerId=${currentUser._id}`), {
          headers: getAuthHeaders(),
        }),
      ]);

      if (!productRes.ok) throw new Error("Failed to load seller products");
      if (!orderRes.ok) throw new Error("Failed to load seller orders");

      const productData = await productRes.json();
      const orderData = await orderRes.json();

      setProducts(productData.map(normalizeProduct));
      setOrders(orderData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser]);

  useEffect(() => {
    if (authError) return;
    
    // Disable linter rule to allow async fetching which triggers state updates
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSellerData();
  }, [authError, fetchSellerData]);

  // ✅ NEW: calculated values
  const totalRevenue = products.reduce(
    (acc, item) => acc + Number(item.price || 0),
    0
  );
  const totalReviews = products.reduce(
    (acc, item) => acc + Number(item.reviewCount || item.reviews?.length || 0),
    0
  );
  const lowStockCount = products.filter((item) => Number(item.stock || 0) <= 5)
    .length;

  const todaySales = totalRevenue;
  const orderRevenue = orders.reduce((sum, order) => {
    const sellerItems = order.items?.filter(
      (item) => (item.seller?._id || item.seller) === currentUser?._id
    ) || [];

    return (
      sum +
      sellerItems.reduce(
        (itemSum, item) => itemSum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      )
    );
  }, 0);

  // ✅ NEW: animated values
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedSales, setAnimatedSales] = useState(0);

  useEffect(() => {
    let rev = 0;
    let sale = 0;

    const interval = setInterval(() => {
      rev += Math.ceil(totalRevenue / 20);
      sale += Math.ceil(todaySales / 20);

      if (rev >= totalRevenue) rev = totalRevenue;
      if (sale >= todaySales) sale = todaySales;

      setAnimatedRevenue(rev);
      setAnimatedSales(sale);

      if (rev === totalRevenue && sale === todaySales) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [totalRevenue, todaySales]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    try {
      const files = Array.from(e.target.files || []);
      const results = await Promise.all(
        files.map((f) => readImageFile(f).catch(() => ""))
      );
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        setProduct((prev) => ({ ...prev, images: [...(prev.images || []), ...valid] }));
      }
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setProduct({
      title: "",
      price: "",
      images: [],
      description: "",
      category: "",
      stock: "",
    });
    setEditingId(null);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

      if (
      !product.title ||
      !product.price ||
      (Array.isArray(product.images) ? product.images.length === 0 : !product.images) ||
      !product.category ||
      !product.stock ||
      !product.description
    ) {
      alert("Please fill every product field and upload an image.");
      return;
    }

    const parsedPrice = Number(product.price);
    const parsedStock = Number(product.stock);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedStock)) {
      setError("Price and stock must be valid numbers.");
      return;
    }

    if (parsedPrice <= 0 || parsedStock < 0) {
      setError("Price must be above 0 and stock cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const headers = getAuthHeaders("application/json");

      const res = await fetch(
        apiUrl(editingId ? `/products/${editingId}` : "/products"),
        {
          method: editingId ? "PATCH" : "POST",
          headers,
          body: JSON.stringify({
            ...product,
            price: parsedPrice,
            stock: parsedStock,
            images: product.images || [],
            sellerId: currentUser._id,
            sellerName: currentUser.businessName || currentUser.name,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save product");
      }

      await fetchSellerData();

      // show success message and redirect to products tab
      setSuccessMessage(
        editingId
          ? "Product updated and sent for admin approval."
          : "Product added and sent for admin approval."
      );
      setActiveTab("products");
      // clear success message after 3s
      setTimeout(() => setSuccessMessage(""), 3000);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setProduct({
      title: item.title || "",
      price: item.price || "",
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : (item.image ? [item.image] : []),
      description: item.description || "",
      category: item.category || "",
      stock: item.stock || "",
    });
    setEditingId(item._id);
    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      const res = await fetch(apiUrl(`/products/${id}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete product");
      }

      await fetchSellerData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSeedSellerProduct = async () => {
    try {
      setSaving(true);
      setError("");

      const res = await fetch(apiUrl("/products"), {
        method: "POST",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({
          title: "Seller Demo Wireless Keyboard",
          price: 2499,
          description: "Compact Bluetooth keyboard with quiet keys and long battery life.",
          category: "Accessories",
          stock: 25,
          image: "",
          sellerId: currentUser._id,
          sellerName: currentUser.businessName || currentUser.name,
          rating: 4.4,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");
      await fetchSellerData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Navbar />

    <div className="bg-[#020617] text-white min-h-screen flex mt-14">
      
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-[#111827] p-6 pt-20 md:pt-6 space-y-6
        transform ${openSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-all duration-500 z-40 shadow-xl md:shadow-none`}
      >
        <div>
          <h2 className="text-2xl font-bold text-purple-400">
            Seller Panel
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {currentUser?.businessName || currentUser?.name || "Your store"}
          </p>
        </div>

        {["dashboard", "add", "products", "orders"].map((tab) => (
          <p
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setOpenSidebar(false);
            }}
            className={`cursor-pointer capitalize px-3 py-2 rounded-lg transition-all duration-300
              ${
                activeTab === tab
                  ? "bg-purple-600 text-white shadow-lg"
                  : "hover:text-purple-400 hover:pl-3"
              }`}
          >
            {tab}
          </p>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-6 md:p-10 w-full overflow-x-hidden">
        {/* ☰ Mobile Menu */}
        <button
          onClick={() => setOpenSidebar(!openSidebar)}
          className="md:hidden mb-6 flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold active:scale-95 transition"
        >
          ☰ Menu
        </button>

        {successMessage ? (
          <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-200">
            {successMessage}
          </div>
        ) : null}

        {(authError || error) ? (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
            {authError || error}
          </div>
        ) : null}

        {activeTab === "dashboard" && (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400 mt-1">
                Products you add here go live after admin approval.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                <h2>Total Products</h2>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>

              <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                <h2>Listed Value</h2>
                <p className="text-2xl font-bold">₹{animatedSales}</p>
              </div>

              <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                <h2>Revenue</h2>
                <p className="text-2xl font-bold">₹{orderRevenue || animatedRevenue}</p>
              </div>

              <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg hover:scale-105 hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer">
                <h2>Reviews</h2>
                <p className="text-2xl font-bold">{totalReviews}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Orders: {orders.length} · Low stock: {lowStockCount}
                </p>
              </div>
            </div>
          </>
        )}

        {/* ADD PRODUCT */}
        {activeTab === "add" && (
          <div className="bg-[#1f2937] p-6 rounded-xl max-w-3xl border border-white/10">
            <h2 className="text-xl mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSaveProduct} className="grid md:grid-cols-2 gap-4">
              
              <input
                name="title"
                value={product.title}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full p-2 rounded bg-[#111827] outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-2 rounded bg-[#111827] outline-none focus:ring-2 focus:ring-purple-500"
              />

              <label className="w-full rounded bg-[#111827] p-2 outline-none cursor-pointer border border-white/10 hover:border-purple-400 transition">
                <span className="text-gray-300">
                  {Array.isArray(product.images) && product.images.length > 0
                    ? `Add more images (${product.images.length})`
                    : "Upload product images"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>

              <input
                name="category"
                value={product.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full p-2 rounded bg-[#111827] outline-none"
              />

              <input
                type="number"
                min="0"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="w-full p-2 rounded bg-[#111827] outline-none"
              />

              {Array.isArray(product.images) && product.images.length > 0 && (
                <div className="md:col-span-2 grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <img key={i} src={img} alt={`preview ${i+1}`} className="w-full h-24 object-cover rounded-lg" />
                  ))}
                </div>
              )}

              <div className="relative w-full md:col-span-2">
                <label className="absolute top-1 left-2 text-gray-400 text-l pointer-events-none">
                  About the product
                </label>

                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full h-32 p-2 pt-5 rounded bg-[#111827] outline-none text-white"
                />
              </div>

              <div className="md:col-span-2">
              <button disabled={saving} className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600 active:scale-95 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-60">
                {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="ml-3 border border-white/20 px-4 py-2 rounded hover:bg-white/10 transition"
                >
                  Cancel
                </button>
              )}
              </div>
            </form>
          </div>
        )}

        {/* PRODUCTS (same as yours) */}
        {activeTab === "products" && (
          <div>
            <h2 className="text-xl mb-4">Your Products</h2>
            {products.length === 0 && (
              <button
                onClick={handleSeedSellerProduct}
                disabled={saving}
                className="mb-5 bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-60"
              >
                Add Sample Product
              </button>
            )}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((item) => (
                <div key={item._id}
                  className="bg-[#111827] p-4 rounded-xl shadow-lg transform hover:-translate-y-2 hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300"
                >
                  <img
                    src={getProductImage(item)}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                    alt="product"
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-400">₹{item.price}</p>
                    </div>

                    <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300 border border-cyan-400/20">
                      {item.category || "General"}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <span>Stock: {item.stock || 0}</span>
                    <span>⭐ {item.rating || 0} ({item.reviewCount || 0})</span>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.approvalStatus === "approved"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : item.approvalStatus === "rejected"
                            ? "bg-red-500/10 text-red-300"
                            : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {productStatusLabel(item)}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  {item.approvalStatus === "rejected" && (
                    <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
                      <p className="font-semibold">Admin review</p>
                      <p className="mt-1">{item.rejectionReason || "No reason provided."}</p>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl mb-4">Customer Orders</h2>

            {orders.length === 0 ? (
              <p className="text-gray-400">No orders for your products yet.</p>
            ) : (
              <div className="space-y-5">
                {orders.map((order) => {
                  const sellerItems =
                    order.items?.filter(
                      (item) => (item.seller?._id || item.seller) === currentUser?._id
                    ) || [];
                  const sellerTotal = sellerItems.reduce(
                    (sum, item) =>
                      sum + Number(item.price || 0) * Number(item.quantity || 0),
                    0
                  );

                  return (
                    <article
                      key={order._id}
                      className="rounded-xl border border-white/10 bg-[#111827] p-5"
                    >
                      <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Order {order._id}</p>
                          <h3 className="font-semibold text-purple-200">
                            {order.buyer?.name || "Buyer"} · {order.buyer?.email}
                          </h3>
                          <p className="mt-1 text-sm text-gray-400">
                            {order.address?.address}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">
                            {order.status}
                          </span>
                          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-300">
                            {order.paymentMethod} · {order.paymentStatus}
                          </span>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                            ₹{sellerTotal}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {sellerItems.map((item) => (
                          <div key={item.product?._id || item.title} className="flex gap-4">
                            <img
                              src={getProductImage(item.product || {})}
                              alt={item.title}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-gray-400">
                                Qty {item.quantity} · ₹{item.price} each
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SellerPage;
