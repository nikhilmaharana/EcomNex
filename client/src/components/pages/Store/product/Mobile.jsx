import Footer from '../../../Footer/Footer';
import Header from '../../../Navbar/Header';
import './Mobile.css'

const Mobiles = () => {
  const products = [
    { id: 1, name: "iPhone 14", price: 70000, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97" },
    { id: 2, name: "Samsung S23", price: 65000, img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf" },
    { id: 3, name: "OnePlus 11", price: 60000, img: "https://images.unsplash.com/photo-1580910051074-3eb694886505" },
    { id: 4, name: "Realme GT", price: 35000, img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97" },
    { id: 5, name: "Vivo V29", price: 30000, img: "https://images.unsplash.com/photo-1585060544812-6b45742d762f" },
    { id: 6, name: "Oppo Reno", price: 28000, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
    { id: 7, name: "Pixel 7", price: 55000, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
    { id: 8, name: "iQOO Neo", price: 32000, img: "https://images.unsplash.com/photo-1580910051074-3eb694886505" },
    { id: 9, name: "Redmi Note 13", price: 18000, img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab" },
    { id: 10, name: "Moto Edge", price: 27000, img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb" },
  ];

  return (
    <div className="product-page">
        <Header/>
      <h1 className="page-title"> Explore Mobiles</h1>

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <img src={p.img} alt={p.name} className="product-img" />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
      <Footer/>
    </div>
  );
};

export default Mobiles;