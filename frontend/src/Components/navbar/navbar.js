import "../../styles/home.css";
import navbarLogo from "../../Images/navbarLogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";

export default function NavBar() {
  const [reqItem, setReqItem] = useState("");
  const [items, setItems] = useState([]);

  const [isActive, setIsActive] = useState(false);
  return (
    <div
      style={{
        width: "100%",
      }}
      className={isActive ? "blur-overlay" : ""}
    >
      <MainBar
        items={items}
        setItems={setItems}
        setReqItem={setReqItem}
        reqItem={reqItem}
        isActive={isActive}
        setIsActive={setIsActive}
      />
    </div>
  );
}

function MainBar({
  items,
  setItems,
  setReqItem,
  reqItem,
  isActive,
  setIsActive,
}) {
  const { cartItems } = useContext(CartContext);
  const [cartActive, setCartActive] = useState(false);
  return (
    <div className="navbar">
      <ul>
        <li>
          <img src={navbarLogo} className="navbar-logo" alt="Hearts"></img>
        </li>
        <li>
          <Link to="/" className="text-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/shop" className="text-link">
            Shop
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-link">
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" className="text-link">
            Contact
          </Link>
        </li>
        <li>
          <SearchBar
            setItems={setItems}
            setReqItem={setReqItem}
            reqItem={reqItem}
            items={items}
            isActive={isActive}
            setIsActive={setIsActive}
          />
        </li>
        <div className="spec-container">
          <li>
            <Link to="/inventory" className="text-link">
              Inventory
            </Link>
          </li>
        </div>
        <li className={!cartActive ? "cart-container" : "active-cart"}>
          <div>
            {!cartActive ? (
              <div>
                <button
                  className={cartItems.length > 0 ? "cart-items" : ""}
                  onClick={() => setCartActive(true)}
                >
                  🛒
                </button>
                {cartItems.length > 0 && <p>{cartItems.length}</p>}
              </div>
            ) : (
              <Cart setCartActive={setCartActive} cartItems={cartItems} />
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

function SearchBar({
  items,
  setItems,
  setReqItem,
  reqItem,
  isActive,
  setIsActive,
}) {
  //State to set searchbar inactive if an item is clicked
  useEffect(() => {
    async function fetchSearch() {
      try {
        const response = await axios.get(
          `http://localhost:5000/inventory/substr/${reqItem}`
        );
        setItems(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    if (reqItem.length > 0) fetchSearch();
  }, [reqItem, setItems]);

  return (
    <div>
      <input
        className="searchBar"
        type="text"
        placeholder=" Search"
        onClick={() => setIsActive(true)}
        value={reqItem}
        onChange={(e) => setReqItem(e.target.value)}
        onBlur={(e) => (e.target.value === "" ? setIsActive(false) : "")}
      ></input>
      {isActive && (
        <div onBlur={() => setIsActive(false)}>
          <SearchResults
            items={items}
            reqItem={reqItem}
            setIsActive={setIsActive}
          />
        </div>
      )}
    </div>
  );
}

function SearchResults({ items, reqItem, setIsActive }) {
  return (
    <div className="search-results">
      {reqItem.length > 0 &&
        items?.map((item, index) => (
          <Link
            key={index + 1}
            to={`/shop/item/${item.itemName}`}
            onClick={() => setIsActive(false)}
          >
            <DisplayItem item={item} />
          </Link>
        ))}
    </div>
  );
}

function DisplayItem({ item }) {
  return (
    <div className="display-itemsearch">
      <img src={item.imageUrl} alt={item.itemName}></img>
      <div className="itemsearch-text">
        <p>{item.itemName}</p>
        <span>${item.price}.00</span>
      </div>
    </div>
  );
}

//Param is for allowing the user to close the cart.
//Purpose is to display & allow modification for the entire cart
function Cart({ setCartActive, cartItems }) {
  async function handleCheckout() {
    try {
      const response = await axios.post(
        "http://localhost:5000/checkout/create-checkout-session",
        { cartItems }
      );

      //redirects to the stripe checkout url returned from the post request
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="basket-container">
      <div className="basket-header">
        <h1>Cart</h1>
        <button
          className="cartdisplay-btn"
          onClick={() => setCartActive(false)}
        >
          🛒
        </button>
      </div>
      {cartItems?.map((item, i) => (
        <CartItem item={item} key={i + 1} />
      ))}
      {cartItems.length > 0 && (
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      )}
    </div>
  );
}

//Function should send a post request with the name, price,
function CartItem({ item }) {
  const { cartItems, removeFromCart, setCartItems } = useContext(CartContext);

  function handleUpdatingItem(op) {
    const currentItem = cartItems.find((curr) => curr.name === item.name);

    if (currentItem.quantity <= 0) return;
    if (currentItem.quantity === 1 || item.quantity === 0) {
      removeFromCart(currentItem.name);
      return;
    }
    const choice = op === "increase" ? 1 : -1;
    const updatedItem = {
      ...currentItem,
      quantity: currentItem.quantity + choice,
    };

    setCartItems(
      cartItems.map((cartItem) =>
        cartItem.name === item.name ? updatedItem : cartItem
      )
    );
  }

  return (
    <div className="cartitem-container">
      <img src={item.url} alt={item.name}></img>
      <h4>{item.name}</h4>
      <div className="cartItemInfo-container">
        <p>${item.price}.00</p>
        <div className="cartquantity-btn">
          <button onClick={() => handleUpdatingItem("decrease")}>-</button>
          <p>{item.quantity}</p>
          <button onClick={() => handleUpdatingItem("increase")}>+</button>
        </div>
      </div>
    </div>
  );
}
