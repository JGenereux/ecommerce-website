import "../styles/home.css";
import navbarLogo from "../Images/navbarLogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [reqItem, setReqItem] = useState("");
  const [items, setItems] = useState([]);

  return (
    <div>
      <MainBar setItems={setItems} setReqItem={setReqItem} reqItem={reqItem} />
      <SearchResults items={items} reqItem={reqItem} />
    </div>
  );
}

function MainBar({ setItems, setReqItem, reqItem }) {
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
        <li className="navbar-searchBar">
          <SearchBar
            setItems={setItems}
            setReqItem={setReqItem}
            reqItem={reqItem}
          />
        </li>
        <div className="spec-container">
          <li>
            <Link to="/inventory" className="text-link">
              Inventory
            </Link>
          </li>
        </div>
        <li>
          <div className="cart-container">
            <button
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              🛒
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
}

function SearchBar({ setItems, setReqItem, reqItem }) {
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
        value={reqItem}
        onChange={(e) => setReqItem(e.target.value)}
      ></input>
    </div>
  );
}

function SearchResults({ items, reqItem }) {
  return (
    <div className="search-results">
      {reqItem.length > 0 &&
        items?.map((item, index) => (
          <DisplayItem item={item} key={index + 1} />
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
        <p>${item.price}.00</p>
      </div>
    </div>
  );
}
