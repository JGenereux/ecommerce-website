//This Context API holds the shopping cart state and contains functions
//to update it, this is used instead of state due to global accessability

import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(item) {
    setCartItems([...cartItems, item]);
  }

  function removeFromCart(name) {
    setCartItems(cartItems.filter((item) => item.name !== name));
  }

  function updateItemQuantity(name, quantity) {
    setCartItems((items) =>
      items.map((item) => (item.name === name ? { ...item, quantity } : item))
    );
  }

  return (
    //Allows for child components to access the cartItems array and it's methods
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        setCartItems,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
