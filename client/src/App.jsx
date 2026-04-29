import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/pages/Home";
import LoginForm from "./components/pages/Auth/Login";
import { Signup } from "./components/pages/Auth/SignUp";
import Store from "./components/pages/Store/Store";
import ProductDetails from "./components/pages/ProductDetails/ProductDetails";
import Cart from "./components/pages/cart/Cart";
import AllProducts from "./components/pages/Store/product/AllProducts";
import Mobiles from "./components/pages/Store/product/Mobile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/store" element={<Store/>} />
       <Route path="/product/:id" element={<ProductDetails />} />
       <Route path="/cart" element={<Cart/>} />
       <Route path="/allproducts" element={<AllProducts/>} />
       <Route path="/mobile" element={<Mobiles/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App