import { Link } from "react-router-dom";
import "./Home.css";
import Footer from "../Footer/Footer";

export  function Home() {
  return (
    <main className="home">
      <header className="navbar">
        <h1 className="logo">EcomNex</h1>
        <nav>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
          <a href="#about">About</a>
          <Link to="/login" className="btn">Login</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h2>The Future of Online Shopping</h2>
          <p>Discover the latest gadgets with a seamless shopping experience.</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn">Shop Now</Link>
            <Link to="/signup" className="btn outline">Create Account</Link>
          </div>
        </div>

        <div className="hero-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="hero-card">
              <img src={`https://source.unsplash.com/300x300/?electronics&sig=${i}`} alt="product" />
            </div>
          ))}
        </div>
      </section>
       <section id="categories" className="section">
        <h3>Shop by Category</h3>
        <div className="grid">
          {["Smartphones","Laptops","Accessories","Wearables"].map(cat => (
            <div key={cat} className="card">{cat}</div>
          ))}
        </div>
      </section>
  <section id="deals" className="section light">
        <h3>Trending Deals</h3>
        <div className="grid">
          {[1,2,3].map(i => (
            <div key={i} className="deal-card">
              <img src={`https://source.unsplash.com/400x300/?tech&sig=${i}`} alt="deal" />
              <h4>Hot Deal #{i}</h4>
              <p>Up to 40% off</p>
            </div>
          ))}
        </div>
      </section>
      <section className="cta">
        <h3>Start Shopping Today</h3>
        <Link to="/login" className="btn">Browse Products</Link>
      </section>

<Footer/>
    </main>
  );
}
