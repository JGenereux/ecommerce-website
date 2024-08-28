import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Navbar from "../navbar/navbar";

import { CartContext } from "../navbar/CartContext";

export default function ItemPage() {
  return (
    <div>
      <Navbar />
      <Item />
    </div>
  );
}

function Item() {
  const { name } = useParams();

  const [quantity, setQuantity] = useState(0);
  const [url, setUrl] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [seen, setSeen] = useState(false); //state for checking if item has been added to the cart

  const { cartItems, addToCart, removeFromCart, updateItemQuantity } =
    useContext(CartContext);

  function handleData(info) {
    setUrl(info["imageUrl"]);
    setItemName(info["itemName"]);
    setPrice(info["price"]);
    setDescription(info["description"]);
  }

  useEffect(() => {
    async function fetchItemData() {
      try {
        const response = await axios.get(
          `http://localhost:5000/inventory/${name}`
        );
        handleData(response.data);
      } catch (error) {
        alert(`Error fetching item data, contact admin. ERROR: ${error}`);
      }
    }
    fetchItemData(name);
  }, [name]);

  useEffect(() => {
    // Synchronize item page quantity with cart
    const foundItem = cartItems.find((item) => item.name === itemName);
    if (foundItem) {
      setQuantity(foundItem.quantity);
      setSeen(true);
    } else if (seen) {
      setQuantity(0);
      setSeen(false);
    }
  }, [cartItems, itemName, seen]);

  function handleAddToCart() {
    //don't add nothing!
    if (quantity === 0) return;

    //CHECK IF ITEM EXISTS IN THE CART ALREADY, DONT WANT DUPLICATES
    const foundItem = cartItems.find((item) => item.name === itemName);
    if (foundItem) return;

    const item = { name, price, quantity, url };
    addToCart(item);
  }

  //want the quantity to be 0 if there is no item otherwise display the
  //item quantity

  return (
    <div className="singleItem-container">
      {url.length > 0 ? (
        <div className="display-singleItem">
          <img src={url} alt={itemName}></img>
          <div className="itemInfo-text">
            <h2 className="itemInfo-title">{itemName}</h2>
            <h3>${price}.00</h3>
            <div className="select-itemsize">
              <label htmlFor="sizes">Sizes: </label>
              <br />
              <select name="sizes" className="size-label">
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div className="select-itemcolor">
              <label htmlFor="colors">Colors: </label>
              <br />
              <select name="colors" className="size-label">
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
              </select>
            </div>
            <div className="additem-button">
              {/*needs to reset to 0 when removing from cart */}
              <button
                onClick={() => {
                  const newQuantity = quantity >= 1 ? quantity - 1 : 0;
                  setQuantity(newQuantity);

                  if (newQuantity === 0) {
                    removeFromCart(itemName);
                  } else {
                    updateItemQuantity(itemName, newQuantity);
                  }
                }}
              >
                -
              </button>
              {/* To synchronize quality from itempage and cart */}
              <p>{quantity}</p>
              <button
                onClick={() => {
                  const newQuantity = quantity >= 99 ? 99 : quantity + 1;
                  setQuantity(newQuantity);
                  updateItemQuantity(itemName, newQuantity);
                }}
              >
                +
              </button>
            </div>
            <button className="addtocart-btn" onClick={handleAddToCart}>
              Add To Cart
            </button>
            <h2 className="item-descriptionTitle">About this item: </h2>
            <p className="item-description">{description}</p>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

function Loading() {
  return <h1 style={{ padding: "50%" }}>Loading</h1>;
}
