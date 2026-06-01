import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();

  const product = location.state?.product;

  const [step, setStep] = useState(1);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("gpay");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    address: "",
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SAVE ADDRESS
  const saveAddress = () => {
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
  };

  // HANDLE PAYMENT
  const handlePayment = () => {

    // GOOGLE PAY
    if (paymentMethod === "gpay") {
      window.open("https://pay.google.com/", "_blank");
    }

    // PHONEPE
    else if (paymentMethod === "phonepe") {
      window.open("https://www.phonepe.com/", "_blank");
    }

    // PAYTM
    else if (paymentMethod === "paytm") {
      window.open("https://paytm.com/", "_blank");
    }

    // CASH ON DELIVERY
    else if (paymentMethod === "cod") {
      setStep(3);
      return;
    }

    // SUCCESS PAGE
    setTimeout(() => {
      setStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

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
          className={`w-10 sm:w-20 h-[2px]
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
          className={`w-10 sm:w-20 h-[2px]
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
                    onClick={() => setPaymentMethod(method.id)}
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

              <button
                onClick={handlePayment}
                className="w-full mt-6 bg-[#6C63FF] hover:bg-[#5b52ff] transition py-4 rounded-2xl font-semibold"
              >
                {paymentMethod === "cod"
                  ? "Confirm Order"
                  : "Pay Now"}
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
                Thank you for shopping with us.
              </p>

              <button
                className="mt-8 bg-[#6C63FF] hover:bg-[#5b52ff]
                transition px-8 py-4 rounded-2xl font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#111827] p-6 rounded-3xl border border-gray-800 h-fit sticky top-10">

          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          {product && (
            <div className="flex gap-4 border-b border-gray-700 pb-5">

              <img
                src={product.image}
                alt={product?.name || "Product image"}
                className="w-24 h-24 rounded-xl object-cover"
              />

              <div>
                <h2 className="font-semibold text-lg">
                  {product.name}
                </h2>

                <p className="text-[#6C63FF] mt-2 text-lg">
                  ₹{product.price}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4 mt-6">

            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>₹{product?.price}</span>
            </div>

            <div className="flex justify-between text-gray-300">
              <span>Delivery</span>
              <span>₹99</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t border-gray-700 pt-4">
              <span>Total</span>

              <span className="text-[#6C63FF]">
                ₹{product?.price + 99}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;