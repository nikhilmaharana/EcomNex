import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(data);
  }, []);

  // Update quantity
  const updateQuantity = (id, qty) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Remove item
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

    return (
  <main className="cart-page">
    <h1 className="cart-title">Shopping Cart</h1>

    {cartItems.length === 0 ? (
      <div className="empty-cart">
        <p>Your cart is empty</p>
        <Link to="/store" className="btn">Continue Shopping</Link>
      </div>
    ) : (
      <div className="cart-layout">

        {/* LEFT: ITEMS */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-card" key={item.id}>
              
              <img
                src={item.images[0]?.src}
                alt={item.name}
                className="cart-image"
              />

              <div className="cart-details">
                <h3>{item.name}</h3>
                <p className="brand">{item.brand}</p>

                <div className="price">
                  ₹{item.price.toLocaleString("en-IN")}
                </div>

                <div className="quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <button className="checkout-btn">Proceed to Checkout</button>
        </div>

      </div>
    )}
  </main>
);
};

export default Cart;