import { useState, useContext } from "react";
import { FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext, DEFAULT_USER } from "../context/UserContext";
import { clearCurrentUser } from "../lib/api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const isLoggedIn = Boolean(user?._id || user?.id);
  const homeRoute = isLoggedIn ? "/home" : "/";
  const profileRoute = user?.role === "buyer" ? "/userProfile" : "/account";

  const handleSearch = () => {
    const query = searchText.trim();
    if (!query) {
      navigate("/product");
      return;
    }
    navigate(`/product?search=${encodeURIComponent(query)}`);
    setSearchText("");
    setOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };
  const currentUser = isLoggedIn
    ? user
    : {
        name: "Guest",
        role: "Buyer",
      };

  const handleLogout = () => {
    clearCurrentUser();
    setUser(DEFAULT_USER);
    setUserMenu(false);
    navigate("/");
  };

  const goToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate(user.role === "buyer" ? "/cart" : homeRoute);
  };

  const goToWishlist = () => {
    navigate(isLoggedIn && user.role === "buyer" ? "/wishlist" : "/login");
  };

  return (
    <nav
      className="
      fixed top-0 left-0 w-full z-50
      bg-[#050816]/90
      backdrop-blur-xl
      border-b border-white/10
      text-white
      px-4 md:px-10
      py-4
      flex items-center justify-between
      shadow-lg shadow-purple-900/10
    "
    >
      {/* LOGO */}
      <h1
        onClick={() => navigate("/home")}
        className="
        text-2xl md:text-3xl
        font-bold
        cursor-pointer
        tracking-wide
      "
      >
        ECom<span className="text-purple-400">Nex</span>
      </h1>

      {/* SEARCH */}
      <div className="hidden md:flex flex-1 mx-8 max-w-xl items-center gap-2">
        <input
          type="text"
          placeholder="Search products..."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="
          flex-1
          px-5 py-2
          rounded-full
          bg-[#111827]
          border border-white/10
          text-white
          placeholder:text-gray-400
          outline-none
          focus:ring-2 focus:ring-purple-500
          transition
        "
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 transition"
        >
          <FaSearch />
        </button>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-7 relative">

        <button
          onClick={() => navigate("/home")}
          className="hover:text-purple-400 transition"
        >
          Home
        </button>

        <button
          onClick={() => navigate("/about")}
          className="hover:text-purple-400 transition"
        >
          About
        </button>

        <button
          onClick={() => navigate("/contact")}
          className="hover:text-purple-400 transition"
        >
          Contact
        </button>

        {/* CART */}
        <FaShoppingCart
          onClick={goToCart}
          className="
          text-xl
          cursor-pointer
          text-purple-400
          hover:scale-110
          hover:text-purple-300
          transition
        "
        />

        {/* WISHLIST */}
        <FaHeart
          onClick={goToWishlist}
          className="
          text-xl
          cursor-pointer
          text-pink-400
          hover:scale-110
          hover:text-pink-300
          transition
        "
        />

        {/* USER */}
        <div className="relative">
          <FaUser
            onClick={() => setUserMenu(!userMenu)}
            className="
            text-xl
            cursor-pointer
            text-indigo-400
            hover:scale-110
            hover:text-indigo-300
            transition
          "
          />

          {/* USER DROPDOWN */}
          {userMenu && (
            <div
              className="
              absolute right-0 top-12
              w-64
              bg-[#111827]
              border border-white/10
              rounded-2xl
              p-4
              shadow-2xl
              backdrop-blur-xl
            "
            >
              {/* USER INFO */}
              <div className="flex items-center gap-3 mb-4">

                <div
                  className="
                  w-12 h-12
                  rounded-full
                  bg-linear-to-r
                  from-purple-500
                  to-indigo-500
                  flex items-center justify-center
                  font-bold text-lg
                "
                >
                  {currentUser?.name?.charAt(0) || "U"}
                </div>

                <div>
                  <p className="font-semibold text-purple-300">
                    {currentUser?.name || "Guest"}
                  </p>

                  <p className="text-sm text-gray-400">
                    {isLoggedIn ? currentUser?.role : "Visitor"}
                  </p>
                </div>
              </div>

              <hr className="border-white/10 mb-3" />

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate(profileRoute);
                    }}
                    className="
                    w-full text-left
                    px-3 py-2 rounded-lg
                    hover:bg-purple-600
                    transition
                  "
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
                    w-full text-left
                    px-3 py-2 rounded-lg
                    hover:bg-red-500
                    transition mt-2
                  "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate("/login");
                    }}
                    className="
                    w-full text-left
                    px-3 py-2 rounded-lg
                    hover:bg-purple-600
                    transition
                  "
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate("/sellerlogin");
                    }}
                    className="
                    w-full text-left
                    px-3 py-2 rounded-lg
                    hover:bg-cyan-600
                    transition mt-2
                  "
                  >
                    Seller Login
                  </button>

                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate("/signup");
                    }}
                    className="
                    w-full text-left
                    px-3 py-2 rounded-lg
                    hover:bg-indigo-600
                    transition mt-2
                  "
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="md:hidden text-2xl text-purple-400"
        onClick={() => setOpen(!open)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="
          absolute top-20 left-0
          w-full
          bg-[#050816]
          border-t border-white/10
          backdrop-blur-xl
          flex flex-col
          items-center
          gap-5
          py-6
          md:hidden
        "
        >

          {/* MOBILE SEARCH */}
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="
            w-[90%]
            px-5 py-2
            rounded-full
            bg-[#111827]
            border border-white/10
            outline-none
            focus:ring-2 focus:ring-purple-500
          "
          />

<button onClick={() => navigate("/home")}>
            Home
          </button>

          <button onClick={() => navigate("/about")}>
            About
          </button>

          <button onClick={() => navigate("/contact")}>
            Contact
          </button>

          <div className="flex gap-8 text-2xl">

            <FaShoppingCart
              onClick={goToCart}
              className="text-purple-400"
            />

            <FaHeart
              onClick={goToWishlist}
              className="text-pink-400"
            />

            <FaUser
              onClick={() => setUserMenu(!userMenu)}
              className="text-indigo-400"
            />
          </div>

          {/* MOBILE USER OPTIONS */}
          {userMenu && (
            <div
              className="
              w-[90%]
              bg-[#111827]
              rounded-2xl
              p-4
              border border-white/10
            "
            >
              <p className="text-purple-300 font-semibold">
                {currentUser?.name || "Guest"}
              </p>

              <p className="text-sm text-gray-400 mb-4">
                {isLoggedIn ? currentUser?.role : "Visitor"}
              </p>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate(profileRoute);
                    }}
                    className="
                    w-full text-left
                    py-2 px-3 rounded-lg
                    hover:bg-purple-600
                  "
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="
                    w-full text-left
                    py-2 px-3 rounded-lg
                    hover:bg-red-500 mt-2
                  "
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate("/login");
                    }}
                    className="
                    w-full text-left
                    py-2 px-3 rounded-lg
                    hover:bg-purple-600
                  "
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate("/sellerlogin");
                    }}
                    className="
                    w-full text-left
                    py-2 px-3 rounded-lg
                    hover:bg-cyan-600 mt-2
                  "
                  >
                    Seller Login
                  </button>

                  <button
                    onClick={() => {
                      setUserMenu(false);
                      navigate("/signup");
                    }}
                    className="
                    w-full text-left
                    py-2 px-3 rounded-lg
                    hover:bg-indigo-600 mt-2
                  "
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
