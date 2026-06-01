import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0F0F1B] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="mb-4 text-xl font-bold">
              <span className="text-white">Ecom</span>
              <span className="text-[#6C63FF]">Nex</span>
            </h2>

            <p className="text-sm text-[#A1A1AA]">
              Your one-stop eCommerce platform with seamless payments and a secure shopping experience.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm text-[#A1A1AA]">
              {["All Products", "New Arrivals", "Best Sellers", "Discounts"].map((item) => (
                <li key={item} className="hover:text-[#6C63FF]">
                  <Link to="/product">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-[#A1A1AA]">
              <li className="hover:text-[#6C63FF]">
                <Link to="/help">Help Center</Link>
              </li>
              <li className="hover:text-[#6C63FF]">
                <Link to="/help">Returns</Link>
              </li>
              <li className="hover:text-[#6C63FF]">
                <Link to="/help">Shipping</Link>
              </li>
              <li className="hover:text-[#6C63FF]">
                <Link to="/orders">Track Order</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Stay Updated</h3>
            <p className="mb-4 text-sm text-[#A1A1AA]">Subscribe for the latest deals, vendor updates, and product drops.</p>
            <div className="flex overflow-hidden rounded-2xl border border-white/10 bg-[#111827]">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-500"
              />
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 text-sm font-semibold transition hover:opacity-90">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-[#A1A1AA] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© 2026 EcomNex. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-[#6C63FF] transition">
              Facebook
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#6C63FF] transition">
              Instagram
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#6C63FF] transition">
              Twitter
            </a>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
