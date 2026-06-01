import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../Footer";
import { apiUrl, getProductImage, normalizeProduct, getAuthHeaders } from "../lib/api";
import { UserContext } from "../context/UserContext";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;
  const fromCart = Boolean(location.state?.fromCart);
  const orderItems = (
    location.state?.items ||
    (product ? [{ product, quantity: 1 }] : [])
  ).map((item) => ({
    product: normalizeProduct(item.product || item),
    quantity: item.quantity || item.qty || 1,
  }));

  const [step, setStep] = useState(1);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [qrConfirmed, setQrConfirmed] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
  });

  const { user: currentUser } = useContext(UserContext);
  const roleHome = {
    seller: "/seller",
    admin: "/admin",
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE ADDRESS
  const saveAddress = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.city ||
      !formData.state ||
      !formData.pincode ||
      !formData.address
    ) {
      setError("Please fill the full delivery address.");
      return;
    }

    const newAddress = {
      id: Date.now(),
      ...formData,
    };

    setAddresses([...addresses, newAddress]);

    setSelectedAddress(newAddress.id);

    setFormData({
      name: "",
      phone: "",
      city: "",
      state: "",
      pincode: "",
      address: "",
    });
    setError("");
  };

  // HANDLE PAYMENT
  const handlePayment = async () => {
    const address = addresses.find((item) => item.id === selectedAddress);

    if (!currentUser?._id) {
      navigate("/login");
      return;
    }

    if (currentUser.role !== "buyer") {
      navigate(roleHome[currentUser.role] || "/");
      return;
    }

    if (!address) {
      setError("Select a delivery address first.");
      return;
    }

    if (orderItems.length === 0) {
      setError("No products selected for checkout.");
      return;
    }

    if (paymentMethod !== "cod") {
      if (paymentMode === "upi" && !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
        setError("Enter a valid UPI ID or choose QR scanner payment.");
        return;
      }

      if (paymentMode === "qr" && !qrConfirmed) {
        setError("Scan the QR code and tick payment completed before confirming.");
        return;
      }
    }

    try {
      setPlacing(true);
      setError("");

      const res = await fetch(apiUrl("/orders"), {
        method: "POST",
        headers: getAuthHeaders("application/json"),
        body: JSON.stringify({
          buyerId: currentUser._id,
          fromCart,
          items: orderItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          address,
          paymentMethod,
          paymentStatus: paymentMethod === "cod" ? "pay_on_delivery" : "paid",
          upiId: paymentMethod === "cod" ? "" : paymentMode === "upi" ? upiId.trim() : "qr-scan",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      setPlacedOrder(data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = orderItems.length > 0 ? 99 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
     <Navbar/>
    <div className="min-h-screen bg-black text-white px-4 py-10 mt-15">
      {error && (
        <div className="max-w-6xl mx-auto mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
          {error}
        </div>
      )}
       

      {/* STEP HEADER */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto">

        {/* ADDRESS */}
        <div className="flex items-center gap-2 min-w-fit">

          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center
            font-bold text-sm transition duration-300
            ${step >= 1
                ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/40"
                : "bg-gray-700 text-gray-300"
              }
            `}
          >
            📍
          </div>

          <span
            className={`font-medium
            ${step >= 1 ? "text-white" : "text-gray-400"}
            `}
          >
            Address
          </span>
        </div>

        {/* LINE */}
        <div
          className={`w-10 sm:w-20 h-0.5
          ${step >= 2 ? "bg-[#6C63FF]" : "bg-gray-700"}
          `}
        ></div>

        {/* PAYMENT */}
        <div className="flex items-center gap-2 min-w-fit">

          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center
            font-bold text-sm transition duration-300
            ${step >= 2
                ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/40"
                : "bg-gray-700 text-gray-300"
              }
            `}
          >
            💳
          </div>

          <span
            className={`font-medium
            ${step >= 2 ? "text-white" : "text-gray-400"}
            `}
          >
            Payment
          </span>
        </div>

        {/* LINE */}
        <div
          className={`w-10 sm:w-20 h-0.5
          ${step >= 3 ? "bg-[#6C63FF]" : "bg-gray-700"}
          `}
        ></div>

        {/* ORDER */}
        <div className="flex items-center gap-2 min-w-fit">

          <div
            className={`
            w-10 h-10 rounded-full flex items-center justify-center
            font-bold text-sm transition duration-300
            ${step >= 3
                ? "bg-[#6C63FF] text-white shadow-lg shadow-[#6C63FF]/40"
                : "bg-gray-700 text-gray-300"
              }
            `}
          >
            ✅
          </div>

          <span
            className={`font-medium
            ${step >= 3 ? "text-white" : "text-gray-400"}
            `}
          >
            Order
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800">

          {/* STEP 1 ADDRESS */}
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold mb-6">
                Delivery Address
              </h1>

              {/* FORM */}
              <div className="space-y-4">

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#6C63FF]"
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#6C63FF]"
                />

                <div className="grid grid-cols-2 gap-4">

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#6C63FF]"
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#6C63FF]"
                  />
                </div>

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#6C63FF]"
                />

                <textarea
                  name="address"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 outline-none h-28 focus:border-[#6C63FF]"
                />

                <button
                  onClick={saveAddress}
                  className="w-full bg-[#6C63FF] hover:bg-[#5b52ff] transition py-3 rounded-xl font-semibold"
                >
                  Save Address
                </button>
              </div>

              {/* SAVED ADDRESSES */}
              <div className="mt-8 space-y-4">

                {addresses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedAddress(item.id)}
                    className={`border rounded-2xl p-4 cursor-pointer transition duration-300
                    ${selectedAddress === item.id
                        ? "border-[#6C63FF] bg-[#6C63FF]/10"
                        : "border-gray-700 bg-black"
                      }`}
                  >

                    <div className="flex justify-between">

                      <div>
                        <h2 className="font-semibold text-lg">
                          {item.name}
                        </h2>

                        <p className="text-gray-400 text-sm">
                          {item.phone}
                        </p>

                        <p className="text-gray-300 mt-2 leading-7">
                          {item.address}, {item.city},
                          {item.state} - {item.pincode}
                        </p>
                      </div>

                      <input
                        type="radio"
                        checked={selectedAddress === item.id}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>

              {selectedAddress && (
                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 bg-[#6C63FF] hover:bg-[#5b52ff] transition py-4 rounded-2xl font-semibold"
                >
                  Continue To Payment
                </button>
              )}
            </>
          )}

          {/* STEP 2 PAYMENT */}
          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold mb-6">
                Payment Method
              </h1>

              <div className="space-y-4">

                {[
                  {
                    id: "gpay",
                    title: "Google Pay",
                    subtitle: "Pay using Google Pay UPI",
                  },

                  {
                    id: "phonepe",
                    title: "PhonePe",
                    subtitle: "Pay using PhonePe UPI",
                  },

                  {
                    id: "paytm",
                    title: "Paytm",
                    subtitle: "Pay using Paytm Wallet",
                  },

                  {
                    id: "cod",
                    title: "Cash On Delivery",
                    subtitle: "Pay after delivery",
                  },
                ].map((method) => (
                  <div
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setError("");
                    }}
                    className={`
                    border rounded-2xl p-5 cursor-pointer transition duration-300
                    ${paymentMethod === method.id
                        ? "border-[#6C63FF] bg-[#6C63FF]/10"
                        : "border-gray-700 bg-black"
                      }
                    `}
                  >

                    <div className="flex justify-between items-center">

                      <div>
                        <h2 className="font-semibold text-lg">
                          {method.title}
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                          {method.subtitle}
                        </p>
                      </div>

                      <input
                        type="radio"
                        checked={paymentMethod === method.id}
                        readOnly
                      />
                    </div>
                  </div>
                ))}
              </div>

              {paymentMethod !== "cod" && (
                <div className="mt-6 rounded-2xl border border-gray-700 bg-black p-5">
                  <h2 className="text-xl font-semibold">Complete UPI Payment</h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Enter your UPI ID or scan the QR code before confirming the order.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMode("upi");
                        setQrConfirmed(false);
                      }}
                      className={`rounded-xl border px-4 py-3 ${
                        paymentMode === "upi"
                          ? "border-[#6C63FF] bg-[#6C63FF]/10"
                          : "border-gray-700"
                      }`}
                    >
                      UPI ID
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMode("qr");
                        setUpiId("");
                      }}
                      className={`rounded-xl border px-4 py-3 ${
                        paymentMode === "qr"
                          ? "border-[#6C63FF] bg-[#6C63FF]/10"
                          : "border-gray-700"
                      }`}
                    >
                      QR Scanner
                    </button>
                  </div>

                  {paymentMode === "upi" ? (
                    <input
                      type="text"
                      value={upiId}
                      onChange={(event) => setUpiId(event.target.value)}
                      placeholder="example@upi"
                      className="mt-4 w-full rounded-xl border border-gray-700 bg-[#111827] px-4 py-3 outline-none focus:border-[#6C63FF]"
                    />
                  ) : (
                    <div className="mt-4 flex flex-col gap-4 rounded-xl bg-[#111827] p-5 sm:flex-row sm:items-center">
                      <div className="grid h-40 w-40 shrink-0 grid-cols-5 gap-1 rounded-xl bg-white p-3">
                        {Array.from({ length: 25 }).map((_, index) => (
                          <span
                            key={index}
                            className={index % 2 === 0 || index % 7 === 0 ? "bg-black" : "bg-white"}
                          />
                        ))}
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          Scan to pay ₹{total}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Demo QR for {paymentMethod.toUpperCase()} UPI. Tick after completing payment in your UPI app.
                        </p>
                        <label className="mt-4 flex items-center gap-3 text-sm text-gray-200">
                          <input
                            type="checkbox"
                            checked={qrConfirmed}
                            onChange={(event) => setQrConfirmed(event.target.checked)}
                          />
                          Payment completed
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={placing}
                className="w-full mt-6 bg-[#6C63FF] hover:bg-[#5b52ff] transition py-4 rounded-2xl font-semibold"
              >
                {placing
                  ? "Placing Order..."
                  : paymentMethod === "cod"
                    ? "Confirm Order"
                    : "Confirm Payment"}
              </button>
            </>
          )}

          {/* STEP 3 SUCCESS */}
          {step === 3 && (
            <div className="text-center py-20">

              <div className="text-7xl mb-5">
                🎉
              </div>

              <h1 className="text-4xl font-bold text-green-400">
                Order Confirmed
              </h1>

              <p className="text-gray-400 mt-4 leading-7">
                Your order has been placed successfully.
                <br />
                Order ID: {placedOrder?._id}
              </p>

              <button
                onClick={() => navigate("/orders")}
                className="mt-8 bg-[#6C63FF] hover:bg-[#5b52ff]
                transition px-8 py-4 rounded-2xl font-semibold"
              >
                View My Orders
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 h-fit sticky top-10">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          {orderItems.length === 0 && (
            <p className="text-gray-400">No products selected.</p>
          )}

          {orderItems.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-4 border-b border-gray-700 py-5 first:pt-0"
            >
              <img
                src={getProductImage(item.product)}
                alt={item.product.title}
                className="w-24 h-24 rounded-xl object-cover"
              />

              <div>
                <h2 className="font-semibold text-lg">
                  {item.product.title}
                </h2>

                <p className="text-[#6C63FF] mt-2 text-lg">
                  ₹{item.product.price} × {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <div className="space-y-4 mt-6">

            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Delivery</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-4">
              <span>Total</span>

              <span className="text-[#6C63FF]">
                ₹{total}
              </span>
            </div>
          </div>
        </div>
      </div>
     
    </div>
     <Footer/>
     </>
  );
};

export default OrderPage;
