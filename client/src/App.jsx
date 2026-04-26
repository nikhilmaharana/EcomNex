import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "./components/pages/ProductDetails/ProductDetails";
import Store from "./components/pages/Store/Store";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
