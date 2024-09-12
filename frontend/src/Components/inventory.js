import Navbar from "./navbar/navbar";
import "../styles/home.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Inventory() {
  return (
    <div
      style={{
        backgroundColor: "#003135",
        minHeight: "100vh", // This ensures the div is at least as tall as the viewport
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar></Navbar>
      <Header />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AddForm />
        <Categories />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ color: "white" }}>
      <h2 className="inventory-header">Inventory Operations</h2>
      <div className="inventory-guide">
        <h2 className="">Guide</h2>
        <p className="">
          This form allows you to add brand new items in a minute right onto
          your store, on the right you can see categories in the shop and also
          add more. Before adding item's please ensure you understand this guide
          to ensure the right info is added. The only section you have to think
          twice about when adding to it is the category, ensure you use one of
          the categories on the right if it is the same as the item being
          entered. But when creating a new category, the only thing to note is
          that it will not add this new category as it's own page in the shop.
          Also if a category has different properties like colors/sizes, those
          options will be shown as soon as the category is entered.
        </p>
      </div>
    </div>
  );
}

function Categories() {
  const [categories, setCategories] = useState([]);

  //Only mounts on first render, gets all current categories stored in the db.
  useEffect(() => {
    async function fetchAllItems() {
      try {
        const response = await axios.get("http://localhost:5000/inventory/");
        fetchAllCategories(response.data);
      } catch (error) {
        console.log("Error fetching all items for inventory. " + error);
      }
    }
    fetchAllItems();
  }, []);

  function fetchAllCategories(items) {
    //stored in a set for easy handling of duplicate categories
    const updatedCategories = Array.from(
      new Set(items.map((item) => item.category))
    );
    setCategories(updatedCategories);
  }

  return (
    <div
      style={{
        maxHeight: "fit-content",
        paddingBottom: "1%",
        width: "415px",
        backgroundColor: "white",
        borderRadius: "10px",
        marginBottom: "250px",
        marginLeft: "30px",
        boxShadow: "5px 5px 8px rgb(3, 3, 5)",
      }}
    >
      <h3 style={{ textAlign: "center", fontFamily: "customFont" }}>
        Categories
      </h3>
      <div
        style={{
          width: "100%",
          borderTop: "2px solid black",
          paddingTop: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
          {categories?.map((category, i) => (
            <CategoryBtn category={category} key={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryBtn({ category }) {
  return (
    <div>
      <button
        className="category-btns"
        style={{
          backgroundColor: "white",
        }}
      >
        {category}
      </button>
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
          className="inventory-text add-form-input"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <input
          className="inventory-text add-form-input"
          type="text"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        <input
          className="inventory-text add-form-input"
          type="text"
          placeholder="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        ></input>
        <input
          className="inventory-text add-form-input"
          type="text"
          placeholder="quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === "" ? "" : e.target.value)
          }
        ></input>
        <textarea
          className="inventory-text inventory-textArea"
          type="text"
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="image-uploadcont">
          {imageUrl.length === 0 && (
            <label
              htmlFor="imagefile"
              style={{
                marginTop: "35px",
                fontFamily: "itemFont",
                fontWeight: "bold",
              }}
            >
              Upload Image
            </label>
          )}
          <input
            className="inventory-uplFile"
            id="imagefile"
            type="file"
            onChange={(e) => handleFile(e)}
          ></input>
        </div>

        {category === "T-Shirts" && (
          <div>
            <div className="category-options">
              <label>Colors</label>
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
            <div className="category-options">
              <label>Sizes</label>
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
