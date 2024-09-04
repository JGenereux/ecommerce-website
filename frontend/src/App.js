import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "./Components/navbar/CartContext";

import Home from "./Components/home";
import Shop from "./Components/Shop/shop";
import ItemPage from "./Components/Shop/itempage";
import About from "./Components/about";
import Contact from "./Components/contact";
import Inventory from "./Components/inventory";

import { AuthProvider } from "./Components/login/authcontext";
import { ProtectedRoute } from "./Components/login/protectedroute";
import LoginPage from "./Components/login/login";
import SignupPage from "./Components/login/signup";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/shop/*" element={<Shop />} />
            <Route path="/shop/item/:name" element={<ItemPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
