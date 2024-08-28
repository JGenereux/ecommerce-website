import Navbar from "../navbar/navbar";
import "../../styles/home.css";
import axios from "axios";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

//All routes lead to different categories which are used to make all of them have the same reusable component based of component-name
export default function Shop() {
  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<LoadInventory category="All Items" />} />
        <Route
          path="/tshirts"
          element={<LoadInventory category="T-Shirts" />}
        />
        <Route
          path="/tumbler-cups"
          element={<LoadInventory category="Tumbler-Cups" />}
        />
        <Route
          path="/home-decor"
          element={<LoadInventory category="Home-Decor" />}
        />
        <Route
          path="/seasonal"
          element={<LoadInventory category="Seasonal" />}
        />
        <Route
          path="/crafting-supplies"
          element={<LoadInventory category="Crafting-Supplies" />}
        />
        <Route
          path="/photo-props"
          element={<LoadInventory category="Photo-props" />}
        />
        <Route path="/custom" element={<LoadInventory category="Custom" />} />
      </Routes>
    </div>
  );
}

//Component is re-rendered each time category is updated.
//Purpose is to display the main page for the shop including the category navigation bar and also have the
//corresponding items listed under it.
function LoadInventory({ category }) {
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);

  //used to ensure it only runs when component mounts
  //request to database to get all items currently stored in the inventory.
  useEffect(() => {
    async function fetchInvData() {
      try {
        const response = await axios.get("http://localhost:5000/inventory/");
        let fetchedItems = response.data;

        //Only sort if needed
        if (category !== "All Items") {
          fetchedItems = fetchedItems.filter(
            (item) => item.category === category
          );
        }
        setItems(fetchedItems);
        setOriginalItems(fetchedItems);
      } catch (error) {
        console.log(error);
      }
    }

    fetchInvData();
  }, [category]);

  return (
    <div>
      <div className="category-navBar">
        <h3>{category}</h3>
        <div className="category-container">
          <CategoryNavBar
            items={items}
            setItems={setItems}
            originalItems={originalItems}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          backgroundColor: "aliceblue",
        }}
      >
        {items?.map((item, i) => (
          <Item
            name={item.itemName}
            price={item.price}
            img={item.imageUrl}
            key={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

//Renders the navigation bar for categories of all items in the shop
//Takes in items prop in order to sort it based off the option chose
//in the select element, and uses the setter function to insure re-rendering
//for the sorted array in the parent component.
function CategoryNavBar({ items, setItems, originalItems }) {
  //every time different option is selected and items are sorted with the option.
  const [sortMethod, setSortMethod] = useState("none");

  function sortByFilter(event) {
    const newSortMethod = event.target.value;
    setSortMethod(newSortMethod);
    if (newSortMethod === "none") {
      setItems([...originalItems]);
      return;
    }

    const sortedItems = [...items].sort((a, b) => {
      if (newSortMethod === "increasingPrice") {
        return a.price - b.price;
      } else if (newSortMethod === "decreasingPrice") {
        return b.price - a.price;
      } else {
        return 0;
      }
    });

    setItems(sortedItems);
  }

  return (
    <div className="categories">
      <Link to="/shop">All Items</Link>
      <Link to="/shop/tshirts">T-Shirts</Link>
      <Link to="/shop/tumbler-cups">Tumbler Cups</Link>
      <Link to="/shop/home-decor">Home Decor</Link>
      <Link to="/shop/seasonal">Seasonal</Link>
      <Link to="/shop/crafting-supplies">Crafting Supplies</Link>
      <Link to="/shop/photo-props">Photo Props</Link>
      <Link to="/shop/custom">Custom</Link>
      <div>
        <select value={sortMethod} onChange={sortByFilter}>
          <option value="none">Featured</option>
          <option value="increasingPrice">Price: Low to High</option>
          <option value="decreasingPrice">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}

//Component for each individual item.
function Item({ name, price, img }) {
  return (
    <div className="item-container">
      <Link to={`/shop/item/${name}`} className="item-links">
        <div className="container">
          <img src={img} alt={name}></img>
          <div className="item-display">
            <p>{name.length > 28 ? `${name.substring(0, 28)}...` : name}</p>
            <h3>${price}.00</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}
