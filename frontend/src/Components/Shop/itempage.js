import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../navbar";

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
              <button
                onClick={() => setQuantity(quantity >= 1 ? quantity - 1 : 0)}
              >
                -
              </button>
              <p>{quantity}</p>
              <button
                onClick={() => setQuantity(quantity >= 99 ? 99 : quantity + 1)}
              >
                +
              </button>
            </div>
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
