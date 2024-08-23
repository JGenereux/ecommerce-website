import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Components/home";
import Shop from "./Components/Shop/shop";
import ItemPage from "./Components/Shop/itempage";
import About from "./Components/about";
import Contact from "./Components/contact";
import Element from "./Components/inventory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/*" element={<Shop />} />
        <Route path="/shop/item/:name" element={<ItemPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inventory" element={<Element />} />
      </Routes>
    </Router>
  );
}

export default App;
