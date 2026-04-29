import "./Footer.css";

const Footer = () => {
  return (
    <>
      {/* SUPPORT */}
      <section className="store-support" id="support">
        <strong>Ready for backend later</strong>
        <span>
          This mock catalog can move into an API without changing the page structure.
        </span>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">

          {/* ABOUT */}
          <div className="footer-column">
            <h4>About</h4>
            <p>
              EcomNex is a modern ecommerce demo platform built to simulate a real online shopping experience.
            </p>
          </div>

          {/* CONTACT */}
          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: support@ecomnex.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Bhubaneswar, India</p>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <a href="#catalog">Shop</a>
            <a href="#categories">Categories</a>
            <a href="#support">Support</a>
          </div>

          {/* CUSTOMER */}
          <div className="footer-column">
            <h4>Customer</h4>
            <a href="#">My Account</a>
            <a href="#">Orders</a>
            <a href="#">Wishlist</a>
            <a href="#">Returns</a>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} EcomNex. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;