import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import merchantImg from "../assets/Merchant.png";
import banner from "../assets/Banner.png";

import Navbar from "../components/Navbar";
import Footer from "../Footer";

const Home = () => {
  const navigate = useNavigate();

  // ✅ Carousel Images
  const images = [banner, merchantImg, banner];

  const [currentIndex, setCurrentIndex] =
    useState(0);

  // ✅ Auto Slide
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentIndex(
        (prev) => (prev + 1) % images.length
      );

    }, 3000);

    return () => clearInterval(interval);

  }, [images.length]);

  // ✅ CATEGORY DATA
  const categories = [

    {
      title: "Phones",
      icon: "📱",
      path: "/category/phones",
    },

    {
      title: "Laptops",
      icon: "💻",
      path: "/category/laptops",
    },

    {
      title: "Tablets",
      icon: "📲",
      path: "/category/tablets",
    },

    {
      title: "Audio",
      icon: "🎧",
      path: "/category/audio",
    },

    {
      title: "Wearables",
      icon: "⌚",
      path: "/category/wearables",
    },

    {
      title: "Accessories",
      icon: "🖱️",
      path: "/category/accessories",
    },

    {
      title: "All Products",
      icon: "🛍️",
      path: "/product",
    },
  ];

  // ✅ FEATURES
  const features = [
    {
      title: "User Friendly",
      desc: "Easy to use interface",
    },

    {
      title: "Best Support",
      desc: "24/7 support system",
    },

    {
      title: "Secure",
      desc: "Safe & secure payments",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="bg-[#020617] min-h-screen text-white">

        <div className="px-4 md:px-10 py-6">

          {/* HERO SECTION */}
          <div
            className="
            bg-linear-to-r
            from-[#0f172a]
            to-[#1e1b4b]
            text-white
            p-6 md:p-10
            rounded-3xl
            flex flex-col md:flex-row
            justify-between
            items-center
            transition duration-500
            hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]
            mt-20
          "
          >

            {/* LEFT CONTENT */}
            <div className="max-w-xl">

              <h1
                className="
                text-3xl md:text-5xl
                font-bold
                leading-tight
                mb-4
              "
              >
                Easiest Shopping Experience
              </h1>

              <p className="text-gray-300 mb-6 text-sm md:text-lg">
                Discover premium gadgets,
                electronics and accessories
                at the best prices.
              </p>

              <button
                onClick={() => navigate("/product")}
                className="
                bg-purple-500
                px-6 py-3
                rounded-xl
                hover:bg-purple-600
                hover:scale-105
                transition duration-300
                font-semibold
              "
              >
                Shop Now
              </button>
            </div>

            {/* CAROUSEL */}
            <div
              className="
              relative
              mt-8 md:mt-0
              // w-full md:w-125
              h-70
              overflow-hidden
              rounded-2xl
              shadow-lg
            "
            >

              {/* IMAGES */}
              <div
                className="
                flex
                transition-transform
                duration-700
              "
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >

                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="slide"
                    className="
                    w-full
                    h-70
                    object-cover
                    shrink-0
                  "
                  />
                ))}
              </div>

              {/* DOTS */}
              <div
                className="
                absolute bottom-4
                left-1/2
                -translate-x-1/2
                flex gap-2
              "
              >

                {images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      setCurrentIndex(i)
                    }
                    className={`
                      w-3 h-3
                      rounded-full
                      cursor-pointer
                      transition
                      
                      ${
                        currentIndex === i
                          ? "bg-purple-500"
                          : "bg-gray-400"
                      }
                    `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CATEGORY SECTION */}
          <div className="mt-14">

            <h2 className="text-3xl font-bold mb-8">
              Shop by Category
            </h2>

            <div
              className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6
            "
            >

              {categories.map((item, index) => (

                <div
                  key={index}
                  onClick={() =>
                    navigate(item.path)
                  }
                  className="
                  bg-[#111827]
                  p-6
                  rounded-2xl
                  text-center
                  transition duration-300
                  hover:bg-purple-600
                  hover:scale-105
                  hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]
                  cursor-pointer
                "
                >

                  <div className="text-5xl mb-4">
                    {item.icon}
                  </div>

                  <h3 className="font-semibold text-lg">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURES */}
          <div
            className="
            grid
            md:grid-cols-3
            gap-6
            mt-16
          "
          >

            {features.map((item, i) => (

              <div
                key={i}
                className="
                bg-[#1f2937]
                p-6
                rounded-2xl
                text-center
                transition duration-300
                hover:bg-purple-600
                hover:-translate-y-2
                hover:shadow-xl
              "
              >

                <h3 className="font-semibold text-xl">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm mt-3">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* PROMO SECTION */}
          <div
            className="
            bg-linear-to-r
            from-[#0f172a]
            to-[#1e1b4b]
            p-6 md:p-10
            rounded-3xl
            flex flex-col md:flex-row
            items-center
            justify-between
            mt-16
            transition duration-500
            hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]
          "
          >

            {/* TEXT */}
            <div className="max-w-lg">

              <h2
                className="
                text-3xl md:text-4xl
                font-bold
              "
              >
                Enjoy Various Merchant Promos
              </h2>

              <p className="text-gray-300 mt-4">
                Get exclusive deals and
                offers on your favorite products.
              </p>

              <button
                className="
                mt-6
                bg-purple-500
                px-6 py-3
                rounded-xl
                hover:bg-purple-600
                hover:scale-105
                transition duration-300
                font-semibold
              "
              >
                Get Started
              </button>
            </div>

            {/* IMAGE */}
            <img
              src={merchantImg}
              alt="promo"
              className="
              mt-8 md:mt-0
              w-full md:w-112.5
              h-70
              object-cover
              rounded-2xl
              shadow-lg
              transition duration-500
              hover:scale-105
            "
            />
          </div>

          {/* FOOTER */}
          <div className="mt-16">
            <Footer />
          </div>

        </div>
      </div>
    </>
  );
};

export default Home;
