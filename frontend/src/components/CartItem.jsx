import { useEffect, useState, useContext } from "react";
import Navbar from "./Navbar";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import { apiUrl, getProductImage, normalizeProduct, getAuthHeaders } from "../lib/api";
import { UserContext } from "../context/UserContext";

const CartItem = () => {

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const { user: currentUser } = useContext(UserContext);
  const authError =
    !currentUser?._id || currentUser.role !== "buyer"
      ? "Please login as a buyer to view your cart."
      : "";

  const mapCartItems = (cart) =>
    (cart.items || []).map((item) => ({
      product: normalizeProduct(item.product),
      qty: item.quantity,
    }));

  useEffect(() => {
    if (authError) return;

    fetch(apiUrl(`/cart/${currentUser._id}`), { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load cart");
        return res.json();
      })
      .then((data) => setCartItems(mapCartItems(data)))
      .catch((err) => setError(err.message));
  }, [authError, currentUser?._id]);

  const updateQty = async (productId, quantity) => {
    try {
      const res = await fetch(apiUrl(`/cart/${currentUser._id}/items/${productId}`), {
        method: "PATCH",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update cart");
      setCartItems(mapCartItems(data));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch(apiUrl(`/cart/${currentUser._id}/items/${productId}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove item");
      setCartItems(mapCartItems(data));
    } catch (err) {
      setError(err.message);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  return (
    <>
    <Navbar/>
    <div className="bg-linear-to-br from-[#05050c] via-[#070717] to-[#0a0a14] min-h-screen px-6 py-20 text-white mt-9">

      <h1 className="text-3xl font-bold text-purple-600 text-center mb-8">
        Cart Items
      </h1>

      {(authError || error) && (
        <p className="mb-6 text-center text-red-300">{authError || error}</p>
      )}

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 flex flex-col gap-6">

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400">Your cart is empty</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-[#0b0b1a] p-4 rounded-lg shadow-lg shadow-purple-900/30 flex items-center gap-4 backdrop-blur-md"
              >
                {/* Image */}
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.title}
                  className="w-24 h-24 object-cover rounded"
                />

                {/* Details */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-purple-400">
                    {item.product.title}
                  </h2>

                  <p className="text-gray-400 text-sm">
                    ₹{item.product.price} × {item.qty}
                  </p>

                  <p className="text-purple-500 font-semibold">
                    ₹{item.product.price * item.qty}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQty(item.product._id, Math.max(1, item.qty - 1))
                      }
                      className="px-2 bg-purple-700 text-white rounded hover:bg-purple-600"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() => updateQty(item.product._id, item.qty + 1)}
                      className="px-2 bg-purple-700 text-white rounded hover:bg-purple-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))
          )}

        </div>

        {/* RIGHT - Summary */}
        <div className="bg-[#0b0b1a] p-6 rounded-lg shadow-lg shadow-purple-900/30 h-fit backdrop-blur-md">

          <h2 className="text-xl font-semibold text-purple-500 mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2 text-gray-300">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span className="font-semibold text-white">₹{total}</span>
          </div>

          <button 
          onClick={()=>{navigate("/order", { state: { fromCart: true, items: cartItems } })}}
          disabled={cartItems.length === 0}
          className="w-full bg-linear-to-r from-purple-700 to-indigo-700 text-white py-3 rounded hover:opacity-90">
            Checkout
          </button>

        </div>

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CartItem;
