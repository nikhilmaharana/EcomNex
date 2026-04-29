import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaSearch } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { useState } from "react";
import "./Header.css";

const Header = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header className="site-header">
      {/* LOGO */}
      <Link className="brand" to="/">
        EcomNex
      </Link>

      {/* CATEGORY DROPDOWN */}
      <div className="category-dropdown">
        <select onChange={(e) => navigate(e.target.value)}>
          <option value="/allproducts">All Categories</option>
          <option value="/mobile">Mobiles</option>
          <option value="/laptops">Laptops</option>
          <option value="/tablets">Tablets</option>
          <option value="/smartwatches">Smartwatches</option>
          <option value="/accessories">Accessories</option>
        </select>
      </div>

      {/* SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {
            if (searchTerm.trim()) {
              navigate(`/store?search=${searchTerm}`);
            }
          }}
        >
          <FaSearch />
        </button>
      </div>

      {/* NAV */}
      <nav className="site-nav">
        <Link to="/">Store</Link>
        <a href="#benefits">Benefits</a>
        <a href="#details">Details</a>
        <a href="#reviews">Reviews</a>
      </nav>

      {/* ACTIONS */}
      <div className="header-actions">
        <button className="icon-button">
          <FaHeart />
        </button>

        <Link to="/cart" className="cart-button">
          <IoCartOutline />
          <span>{cartCount}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;