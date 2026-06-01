import React from 'react'
import { Route, Routes } from 'react-router-dom'


import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Home from './pages/Home'
import SellerPage from './pages/SellerPage'
import Product from './pages/Product';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RootPage from './components/RootPage';



import Navbar from './components/Navbar'
import Footer from './Footer';

import Card from './components/product/Card'
import LandingPage from './components/LandingPage'
import About from './components/About'
import Wishlist from './components/Wishlist'
import Contact from './components/Contact'
import HelpCenter from './components/HelpCenter'
import CartItem from './components/CartItem'
import UserLogin from './components/auth/userauth/Login'
import UserSignup from './components/auth/userauth/SignUp'
import SellerLogin from './components/auth/sellerauth/SellerLogin';
import SellerSignup from './components/auth/sellerauth/SellersignUp';
import AdminLogin from './components/auth/adminauth/AdminLogin';
import AdminPage from './pages/AdminPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';

import Profile from './components/profile/Profile'
import Account from './components/profile/Account';
import Address from './components/profile/Address';
import EditProfile from './components/profile/EditProfile';



const App = () => {
  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="*" element={<RootPage />} />

        <Route path="/login" element={<PublicRoute><UserLogin/></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><UserSignup/></PublicRoute>} />

        <Route path="/sellerlogin" element={<PublicRoute><SellerLogin/></PublicRoute>} />
        <Route path="/sellersignup" element={<PublicRoute><SellerSignup/></PublicRoute>} />
        <Route path="/seller" element={<ProtectedRoute allowedRoles={["seller"]} redirectTo="/sellerlogin"><SellerPage/></ProtectedRoute>} />
        <Route path="/adminlogin" element={<PublicRoute><AdminLogin/></PublicRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/adminlogin"><AdminPage/></ProtectedRoute>} />

        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={["buyer"]}><CartItem /></ProtectedRoute>} />

        <Route path="/order" element={<ProtectedRoute allowedRoles={["buyer"]}><OrderPage/></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute allowedRoles={["buyer"]}><OrdersPage/></ProtectedRoute>} />

        <Route path="/card" element={<Card />} />

        <Route path="/product" element={<Product/>} />
        <Route path="/category/:slug" element={<Product />} />

        <Route path="/productlist" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />


      <Route path='/userProfile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>   
      <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>} />
      <Route path="/address" element={<ProtectedRoute><Address/></ProtectedRoute>} />
<Route path="/myprofile" element={<ProtectedRoute><EditProfile/></ProtectedRoute>} />

      </Routes>
    </main>
  )
}

export default App
