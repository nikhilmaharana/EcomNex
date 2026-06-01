import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Footer from "../Footer";

export default function LandingPage() {
  // 🔁 HERO CAROUSEL
  const slides = [
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSOvLWwWxRm9XkLkXeiEayTJeIC3qf1YrEf-OWZ-n-4pUy7h878VIEWllL0K0sTTSRB30DigJK9310clb6m3ibK-XMX96ghtzSD2dV1DJhiLwOZyIguojSlJB18P4bC8X_N2X0_Br2ORJI&usqp=CAc",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgcUPg4g_dN8pcgASwqaMGgtWi7S8R4FVo5Q&s",
    "https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/24435058/2023/8/14/5e0fb72d-aa26-4de7-999a-199e01ed1df21691985473864SamsungGalaxyWatch6LTE44mmSilverCompatiblewithAndroidonly1.jpg",
  ];

  // 🔁 NEW PRODUCT CAROUSEL (before testimonials)
  const productSlides = [
    "https://img.freepik.com/free-psd/black-friday-big-sale-social-media-post-design-template_47987-25239.jpg?semt=ais_hybrid&w=740&q=80",
    "https://img.freepik.com/premium-psd/smartphone-sale-banner-template_185005-374.jpghttps://img.freepik.com/premium-psd/smartphone-sale-banner-template_185005-374.jpg",
    "https://img.freepik.com/premium-vector/new-laptop-sale-promotion-social-facebook-cover-banner_252779-424.jpg",
  ];

  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % productSlides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [productSlides.length]);

  return (
    <main className="min-h-screen bg-[#0f1221] text-white overflow-hidden relative">

      {/* 🌌 Glow */}
      <div className="pointer-events-none absolute w-100 h-100 bg-purple-600/20 blur-3xl rounded-full top-10 left-10"></div>
      <div className="pointer-events-none absolute w-75 h-75 bg-indigo-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      {/* 🌐 NAV */}
      <nav className="flex justify-between items-center px-6 py-4 relative z-10">
        <h1 className="text-xl font-bold">
          ECom<span className="text-purple-400">Nex</span>
        </h1>

        <Link
          to="/signup"
          className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-500 to-indigo-500"
        >
          Sign Up
        </Link>
      </nav>

      {/* 🚀 HERO */}
      <section className="grid md:grid-cols-2 items-center px-6 mt-16 gap-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-4xl md:text-5xl font-bold">
            Discover & Sell with{" "}
            <span className="text-purple-400">Ease</span>
          </h2>

          <p className="text-gray-400 mt-4">
            The smartest marketplace for buyers and sellers.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-purple-500 rounded-xl"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </motion.div>

        <motion.img
          key={index}
          src={slides[index]}
          alt={`Slide ${index + 1} of featured products`}
          onClick={() => navigate("/product")}
          className="rounded-2xl h-75 w-full object-cover cursor-pointer"
        />
      </section>

      {/* 🏆 WHAT MAKES US STAND OUT */}
      <section className="mt-16 px-6">
        <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Fast Checkout",
              description: "Secure payments and seamless order processing for every purchase.",
            },
            {
              title: "Verified Sellers",
              description: "Only trusted merchants with high ratings and verified listings.",
            },
            {
              title: "Smart Support",
              description: "24/7 assistance for buyers and sellers so your store never stops.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-purple-900/10 transition hover:-translate-y-1 hover:border-purple-500/40"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300 mb-3">
                {item.title}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🛍️ CATEGORIES */}
      <section className="mt-16 px-6">
        <h3 className="text-2xl text-center font-semibold mb-8">Explore Popular Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 max-w-6xl mx-auto">
          {[
            { name: "Phones", emoji: "📱" },
            { name: "Laptops", emoji: "💻" },
            { name: "Wearables", emoji: "⌚" },
            { name: "Audio", emoji: "🎧" },
            { name: "Accessories", emoji: "🎒" },
          ].map((category) => (
            <div
              key={category.name}
              className="rounded-3xl border border-white/10 bg-[#111827] p-5 text-center transition hover:-translate-y-1 hover:border-purple-500/40 hover:bg-white/5"
            >
              <div className="text-4xl mb-4">{category.emoji}</div>
              <p className="font-semibold text-white">{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔁 NEW CAROUSEL (BEFORE TESTIMONIALS) */}
      <section className="mt-20 px-6 text-center">
        <h3 className="text-2xl font-bold mb-6">Featured Picks</h3>

        <motion.img
          key={productIndex}
          src={productSlides[productIndex]}
          alt={`Featured product ${productIndex + 1}`}
          onClick={() => navigate("/product")}
          className="mx-auto rounded-2xl h-62.5 w-[80%] object-cover shadow-xl cursor-pointer"
        />
      </section>

      {/* 📊 STATS */}
<section className="mt-20 px-6 text-center">
  <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

    {[
      { number: "10K+", label: "Active Users" },
      { number: "5K+", label: "Products Available" },
      { number: "1K+", label: "Trusted Sellers" },
    ].map((stat, i) => (
      <div
        key={i}
        className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:scale-105 transition"
      >
        <h4 className="text-3xl font-bold text-purple-400">
          {stat.number}
        </h4>
        <p className="text-gray-400 mt-2">{stat.label}</p>
      </div>
    ))}

  </div>
</section>

      {/* 🌟 TESTIMONIALS */}
  <section className="mt-20 px-6 text-center">
  <h3 className="text-2xl font-bold mb-8">What Users Say</h3>

  <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {[
      {
        text: "Absolutely love this platform! The UI is smooth, products are great, and checkout is super fast. It made my shopping experience effortless.",
        name: "Aarav Mehta",
        role: "Buyer"
      },
      {
        text: "As a seller, this platform helped me grow my business quickly. Managing products and orders is extremely easy.",
        name: "Priya Sharma",
        role: "Seller"
      },
      {
        text: "The design is clean and modern. Everything feels intuitive and well thought out. Highly recommended!",
        name: "Rohan Verma",
        role: "Buyer"
      },
      {
        text: "I found exactly what I needed within minutes. The recommendations are surprisingly accurate.",
        name: "Neha Kapoor",
        role: "Buyer"
      },
      {
        text: "Setting up my store was quick and hassle-free. Great experience for new sellers like me.",
        name: "Kunal Singh",
        role: "Seller"
      },
      {
        text: "Fast delivery, smooth checkout, and great product quality. This is my go-to shopping app now.",
        name: "Simran Kaur",
        role: "Buyer"
      }
    ].map((review, i) => (
      <div
        key={i}
        className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:scale-105 transition"
      >
        {/* ⭐ Stars */}
        <div className="flex justify-center mb-3">
          {[...Array(5)].map((_, j) => (
            <Star
              key={j}
              size={16}
              className="text-yellow-400 fill-yellow-400"
            />
          ))}
        </div>

        {/* 💬 Review */}
        <p className="text-gray-300 text-sm leading-relaxed">
          “{review.text}”
        </p>

        {/* 👤 User */}
        <div className="mt-4">
          <p className="text-purple-400 font-semibold text-sm">
            {review.name}
          </p>
          <p className="text-gray-500 text-xs">
            {review.role}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* 🚀 CTA WITH IMAGE */}
      <section className="mt-20 px-6">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-5xl mx-auto">

             {/* RIGHT IMAGE */}
         <section className="mt-20 px-6 text-center">
     

        <motion.img
          key={productIndex}
          src={productSlides[productIndex]}
          alt={`Promo product ${productIndex + 1}`}
          className="mx-auto rounded-2xl h-62.5 w-[80%] object-cover shadow-xl"
        />
      </section>
          {/* LEFT TEXT */}
          <div>
            <h3 className="text-3xl font-bold">
              Ready to Get Started?
            </h3>

            <Link
              to="/signup"
              className="inline-block mt-6 px-8 py-3 rounded-xl bg-linear-to-r from-purple-500 to-indigo-500"
            >
              Create Account
            </Link>
          </div>

    
        </div>
      </section>

     <Footer/>

    </main>
  );
}
