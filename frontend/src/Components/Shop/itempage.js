import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Navbar from "../navbar/navbar";

import { CartContext } from "../navbar/CartContext";

export default function ItemPage() {
  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Item />
      </div>
    </div>
  );
}

//Display a page for a single item
function Item() {
  const { name } = useParams();

  const [quantity, setQuantity] = useState(0);
  const [url, setUrl] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [seen, setSeen] = useState(false); //state for checking if item has been added to the cart

  const { cartItems, addToCart, removeFromCart, updateItemQuantity } =
    useContext(CartContext);

  // Function handles setting all information about the item
  // param is the response sent from the database
  function handleData(info) {
    setUrl(info["imageUrl"]);
    setItemName(info["itemName"]);
    setPrice(info["price"]);
    setDescription(info["description"]);
    setCategory(info["category"]);
    if (info["category"] === "T-Shirts") {
      setColors(info["colors"]);
      setSizes(info["sizes"]);
    }
  }

  // gets all info for a specific item, which is then
  // called in handleData which sets the item's states
  // with the appropiate info
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
    fetchItemData();
  }, [name]);

  // Synchronizes the quantity displayed on the item page with the
  // quantity that is kept in the cart
  useEffect(() => {
    const foundItem = cartItems.find((item) => item.name === itemName);
    //If item is in the cart already, match quantity with what is in cart.
    if (foundItem) {
      setQuantity(foundItem.quantity);
      setSeen(true);
    } else if (seen) {
      setQuantity(0);
      setSeen(false);
    }
  }, [cartItems, itemName, seen]);

  function handleAddToCart() {
    //don't add anything if it has no quantity!
    if (quantity === 0) return;

    //CHECK IF ITEM EXISTS IN THE CART ALREADY, DONT WANT DUPLICATES
    const foundItem = cartItems.find((item) => item.name === itemName);
    if (foundItem) return;

    const item = { name, price, quantity, url };
    addToCart(item);
  }

  return (
    <div className="singleItem-container">
      {url.length > 0 ? (
        <div className="display-singleItem">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <img src={url} alt={itemName}></img>
            <Reviews itemName={itemName} />
          </div>
          <div className="itemInfo-text">
            <h2 className="itemInfo-title">{itemName}</h2>
            <h3>${price}.00</h3>
            {/* Only render options for categories that have them */}
            {category === "T-Shirts" && (
              <>
                {colors.length > 0 && (
                  <div className="select-itemcolor">
                    <label htmlFor="colors">Colors: </label>
                    <br />
                    <select name="colors" className="size-label">
                      {colors?.map((color, index) => (
                        <option value={color} key={index}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {sizes.length > 0 && (
                  <div className="select-itemsize">
                    <label htmlFor="sizes">Sizes: </label>
                    <br />
                    <select name="sizes" className="size-label">
                      {sizes?.map((size, index) => (
                        <option value={size} key={index}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
            <div
              className={
                (colors.length > 0 || sizes.length) > 0
                  ? "itemOptions-container itemChoices"
                  : "itemOptions-container"
              }
            >
              <label className="quantity-text">Quantity</label>
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
                <p className="item-quantity">{quantity}</p>
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
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}

//Displays all the reviews for a single item
function Reviews({ itemName }) {
  const [reviews, setReviews] = useState([
    {
      itemName: "20 oz Cool Cup",
      userName: "Carlos Borat",
      rating: 4,
      comment: "This is such a cool item will consider purchasing again!",
    },
  ]);
  //Fetch all reviews for a single item
  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          `http://localhost:5000/reviews/${itemName}`
        );
        //setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchReviews();
  }, [itemName]);

  return (
    <div>
      {reviews?.map((review, i) => (
        <SingleReview review={review} key={i + 1} />
      ))}
    </div>
  );
}

function SingleReview({ review }) {
  const [rating, setRating] = useState(review["rating"]);
  const userName = review["userName"];
  const reviewdesc = review["comment"];
  const itemName = review["itemName"];

  return (
    <div className="singleReview">
      <div className="singleReview-container">
        <p className="singleReview-username">{userName}</p>
        <div className="starRatings-container">
          <p>{rating}</p>
          <Rating currentRating={rating} onRatingChange={setRating} />
        </div>
      </div>
      <p className="singleReview-description">{reviewdesc}</p>
      <p className="singleReview-itemName">Item: {itemName}</p>
    </div>
  );
}

//Renders the current rating with 5 stars that are highlighted from 1 to rating.
function Rating({ currentRating, onRatingChange }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          filled={star <= currentRating}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
}

//Renders a single star that is filled based on the value of filled.
function Star({ filled, onClick }) {
  const starPoints =
    "M9,2 L11,7 L16,7 L12.5,10 L14,15 L9,12.5 L4,15 L5.5,10 L2,7 L7,7 Z";

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <path
        d={starPoints}
        fill={filled ? "gold" : "none"}
        stroke="black"
        strokeWidth="1"
      />
    </svg>
  );
}

function Loading() {
  return <h1 style={{ padding: "50%" }}>Loading</h1>;
}
