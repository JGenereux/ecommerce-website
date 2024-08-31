import Navbar from "./navbar/navbar";
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

  const [colors, setColors] = useState({
    colorOne: "",
    colorTwo: "",
    colorThree: "",
  });
  const [sizes, setSizes] = useState({
    sizeOne: "",
    sizeTwo: "",
    sizeThree: "",
  });

  //Handles uploading the given image to IMGUR which then returns a url containing that image.
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

  //Handles uploading the entire item into the inventory database
  async function handleSubmit(e) {
    e.preventDefault();

    //filter out all empty values in the arrays
    //Object.values converts the object into an array of only the values(not keys)
    const newColors = Object.values(colors).filter((item) => item !== "");
    const newSizes = Object.values(sizes).filter((item) => item !== "");

    if (Number(price) <= 0 || Number(quantity) <= 0) {
      window.alert(
        "Error: Please ensure price and quantity are greater than 0"
      );
      return;
    }

    if (
      category.trim().length === 0 ||
      name.trim().length === 0 ||
      imageUrl.length === 0 ||
      description.length === 0
    ) {
      window.alert("Error: Please ensure all fields are filled out");
      return;
    }

    const newItem = {
      itemName: name.trim(),
      price: Number(price),
      category: category.trim(),
      quantity: quantity,
      imageUrl: imageUrl,
      description: description,
    };

    //Since some items may not have any options, only include them if needed.
    if (newColors.length > 0) {
      newItem.colors = newColors;
    }
    if (newSizes.length > 0) {
      newItem.sizes = newSizes;
    }

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
      setColors({
        colorOne: "",
        colorTwo: "",
        colorThree: "",
      });
      setSizes({
        sizeOne: "",
        sizeTwo: "",
        sizeThree: "",
      });
      //Make confirmed message
      if (response.data.ok) {
        alert("Image was uploaded successfully");
      }
    } catch (error) {
      alert(`Problem creating entry, please contact admin. Error: ${error}`);
    }
  }

  function handleColorChange(e) {
    //extracts name of element and value
    const { name, value } = e.target;
    //Updates the colors array with a new value for the adjacent name
    setColors((prevColors) => ({
      ...prevColors,
      [name]: value,
    }));
  }

  function handleSizeChange(e) {
    const { name, value } = e.target;
    setSizes((prevSizes) => ({
      ...prevSizes,
      [name]: value,
    }));
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
            setQuantity(e.target.value === "" ? "" : e.target.value)
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

        {category === "T-Shirts" && (
          <div>
            <label>Colors</label>
            <div className="category-options">
              <input
                type="text"
                name="colorOne"
                value={colors.colorOne}
                onChange={(e) => handleColorChange(e)}
              ></input>
              <input
                type="text"
                name="colorTwo"
                value={colors.colorTwo}
                onChange={(e) => handleColorChange(e)}
              ></input>
              <input
                type="text"
                name="colorThree"
                value={colors.colorThree}
                onChange={(e) => handleColorChange(e)}
              ></input>
            </div>
            <label>Sizes</label>
            <div className="category-options">
              <input
                type="text"
                name="sizeOne"
                value={sizes.sizeOne}
                onChange={(e) => handleSizeChange(e)}
              ></input>
              <input
                type="text"
                name="sizeTwo"
                value={sizes.sizeTwo}
                onChange={(e) => handleSizeChange(e)}
              ></input>
              <input
                type="text"
                name="sizeThree"
                value={sizes.sizeThree}
                onChange={(e) => handleSizeChange(e)}
              ></input>
            </div>
          </div>
        )}
        <p>{imageUrl}</p>
        <button type="submit" className="inventory-submit button-30">
          Add Item
        </button>
      </form>
    </div>
  );
}

function Checkboxes() {}

function Header() {
  return <h2 className="inventory-header">Inventory Operations</h2>;
}
