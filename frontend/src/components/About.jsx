import Footer from "../Footer";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="bg-linear-to-br from-[#050507] via-[#0b0b1a] to-[#0a0a14] text-gray-200 font-sans mt-15">

      {/* HERO */}
      <div className="h-[30vh] bg-linear-to-r from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold tracking-wider">TechSphere</h1>
          <p className="text-lg mt-2">
            Upgrade Your Lifestyle with Smart Gadgets ✨
          </p>
        </div>
      </div>

      {/* ABOUT */}
      <section className="py-16 px-5 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold text-purple-400 mb-3">
          Who We Are
        </h2>
        <p className="text-gray-400 leading-relaxed">
          TechSphere is your trusted digital marketplace for laptops, tablets,
          smartphones, earbuds, and more. We blend innovation with affordability
          to bring the latest technology right to your fingertips.
        </p>
      </section>

      {/* CATEGORIES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-8 py-10">
        
        <div className="bg-[#0b0b1a] rounded-2xl p-6 text-center shadow-md shadow-purple-900/30 hover:shadow-purple-700/40 transition duration-300 cursor-pointer backdrop-blur-md">
          <span className="text-4xl">💻</span>
          <h3 className="mt-3 text-purple-400 text-lg font-semibold">Laptops</h3>
          <p className="text-gray-400 text-sm">
            Powerful machines for work & gaming
          </p>
        </div>

        <div className="bg-[#0b0b1a] rounded-2xl p-6 text-center shadow-md shadow-purple-900/30 hover:shadow-purple-700/40 transition duration-300 cursor-pointer backdrop-blur-md">
          <span className="text-4xl">📱</span>
          <h3 className="mt-3 text-purple-400 text-lg font-semibold">Phones</h3>
          <p className="text-gray-400 text-sm">
            Latest smartphones with sleek design
          </p>
        </div>

        <div className="bg-[#0b0b1a] rounded-2xl p-6 text-center shadow-md shadow-purple-900/30 hover:shadow-purple-700/40 transition duration-300 cursor-pointer backdrop-blur-md">
          <span className="text-4xl">🎧</span>
          <h3 className="mt-3 text-purple-400 text-lg font-semibold">Earbuds</h3>
          <p className="text-gray-400 text-sm">
            Immersive sound experience
          </p>
        </div>

        <div className="bg-[#0b0b1a] rounded-2xl p-6 text-center shadow-md shadow-purple-900/30 hover:shadow-purple-700/40 transition duration-300 cursor-pointer backdrop-blur-md">
          <span className="text-4xl">📟</span>
          <h3 className="mt-3 text-purple-400 text-lg font-semibold">Tablets</h3>
          <p className="text-gray-400 text-sm">
            Portable & powerful devices
          </p>
        </div>

      </section>

      {/* MISSION */}
      <section className="py-16 px-5 text-center max-w-3xl mx-auto bg-[#0b0b1a] rounded-2xl shadow-lg shadow-purple-900/30 backdrop-blur-md">
        <h2 className="text-3xl font-semibold text-purple-400 mb-3">
          Our Mission
        </h2>
        <p className="text-gray-400 leading-relaxed">
          To make cutting-edge technology accessible to everyone with premium
          quality, fast delivery, and excellent support.
        </p>
      </section>

      {/* FEATURES */}
      <section className="flex flex-wrap justify-center gap-5 py-10 px-5">
        <div className="bg-linear-to-r from-purple-800 to-indigo-900 text-white px-6 py-3 rounded-full shadow-md">
          ✔ Premium Quality
        </div>
        <div className="bg-linear-to-r from-purple-800 to-indigo-900 text-white px-6 py-3 rounded-full shadow-md">
          ✔ Fast Delivery
        </div>
        <div className="bg-linear-to-r from-purple-800 to-indigo-900 text-white px-6 py-3 rounded-full shadow-md">
          ✔ Secure Payment
        </div>
        <div className="bg-linear-to-r from-purple-800 to-indigo-900 text-white px-6 py-3 rounded-full shadow-md">
          ✔ 24/7 Support
        </div>
      </section>

      

    </div>
    <Footer/>
    </>
  );
};

export default About;