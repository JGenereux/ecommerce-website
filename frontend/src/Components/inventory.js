import Navbar from "./navbar";
import "../styles/home.css";
import axios from "axios";
import { useState } from "react";

export default function Inventory() {
  return (
    <div>
      <Navbar></Navbar>
      <Header />
      <AddForm />
    </div>
  );
}

function AddForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  async function handleFile(e) {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:5000/image/api/upload",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      setImageUrl(response.data.imageUrl);
      e.target.value = "";
    } catch (error) {
      alert(`Problem creating entry, please contact admin. Error: ${error}`);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newItem = {
      itemName: name.trim(),
      price: Number(price),
      category: category.trim(),
      quantity: quantity,
      imageUrl: imageUrl,
      description: description,
    };

    if (
      isNaN(price) ||
      isNaN(quantity) ||
      category.trim().length === 0 ||
      name.trim().length === 0 ||
      imageUrl.length === 0 ||
      description.length === 0
    )
      return;

    try {
      const response = await axios.post(
        "http://localhost:5000/inventory/add",
        newItem
      );

      setName("");
      setPrice("");
      setCategory("");
      setQuantity("");
      setImageUrl("");
      setDescription("");
    } catch (error) {
      alert(`Problem creating entry, please contact admin. Error: ${error}`);
    }
  }
  return (
    <div className="inventory-form">
      <form onSubmit={handleSubmit} className="add-form">
        <input
          className="inventory-text"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          className="inventory-text"
          type="text"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        <input
          className="inventory-text"
          type="text"
          placeholder="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        ></input>
        <input
          className="inventory-text"
          type="text"
          placeholder="quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === "" ? "" : Number(e.target.value))
          }
        ></input>
        <input
          className="inventory-text"
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></input>
        <input
          className="inventory-uplFile"
          type="file"
          onChange={(e) => handleFile(e)}
        ></input>
        <p>{imageUrl}</p>
        <button type="submit" className="inventory-submit button-30">
          Add Item
        </button>
      </form>
    </div>
  );
}

function Header() {
  return <h2 className="inventory-header">Inventory Operations</h2>;
}
