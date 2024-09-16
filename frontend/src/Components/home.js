import header from "../Images/header.jpg";
import Footer from "./footer";
import Navbar from "./navbar/navbar";
import axios from "axios";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Header />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <FeaturedProducts />
      </div>
      <Description />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className="header-container">
      <img
        src={header}
        style={{
          height: "60vh",
          width: "100%",
          filter: "brightness(69%)",
        }}
        alt="Heartland Shoppes Header"
      ></img>
      <h3>Heartland Shoppes</h3>
      <p>
        Discover the Heart of Shopping at Heartland Shoppes – Where Quality
        Meets Community.
      </p>
      <Link to="/shop" className="shopbtn-link">
        Shop Now
      </Link>
    </div>
  );
}

function FeaturedProducts() {
  const [items, setItems] = useState([]);
  const [displayItems, setDisplayItems] = useState([]);
  const [beginRange, setBeginRange] = useState(0);
  const [endRange, setEndRange] = useState(4);

  useEffect(() => {
    async function getFetchedItems() {
      try {
        const response = await axios.get(
          "https://heartland-shoppes-server.vercel.app/inventory/"
        );
        const fetchedItems = response.data;

        const slicedItems = fetchedItems.slice(0, 4);
        setDisplayItems(slicedItems);
        setItems(fetchedItems);
      } catch (error) {
        console.log(error);
      }
    }
    getFetchedItems();
  }, []);

  function handleRightRotate() {
    //do nothing if moving right will be out of bounds
    if (endRange >= items.length) {
      return;
    }
    const slicedItems = items.slice(beginRange + 1, endRange + 1);
    setBeginRange(beginRange + 1);
    setEndRange(endRange + 1);
    setDisplayItems(slicedItems);
  }

  function handleLeftRotate() {
    //do nothing if moving left will be out of bounds
    if (beginRange <= 0) {
      return;
    }
    const slicedItems = items.slice(beginRange - 1, endRange - 1);
    setBeginRange(beginRange - 1);
    setEndRange(endRange - 1);
    setDisplayItems(slicedItems);
  }

  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "10px",
        width: "70%",
      }}
    >
      <h2 className="ftproducts-header">Featured Products</h2>
      <div className="ftproducts-container">
        {beginRange > 0 && <button onClick={handleLeftRotate}>&#8592;</button>}
        {displayItems?.map((item, i) => (
          <Item item={item} key={i + 1} />
        ))}
        {endRange < items.length && (
          <button style={{ marginLeft: "15px" }} onClick={handleRightRotate}>
            &#8594;
          </button>
        )}
      </div>
    </div>
  );
}

function Item({ item }) {
  return (
    <Link to={`/shop/item/${item.itemName}`} className="item-links">
      <div className="ftproducts-singleitem">
        <img src={item.imageUrl} alt={item.itemName}></img>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            paddingLeft: "5px",
          }}
        >
          <p style={{ margin: 0, marginTop: 10 }}>
            {item.itemName.length > 30
              ? `${item.itemName.substring(0, 23)}..`
              : item.itemName}
          </p>
          <p style={{ margin: 0, marginTop: 5 }}>${item.price}.00</p>
        </div>
      </div>
    </Link>
  );
}

function Description() {
  return (
    <div>
      <h2 className="descHeader-container">
        Express yourself with a Unique Handmade Gift
      </h2>
      <div className="description-container">
        <p>
          How would you like to express yourself? Guaranteed, family and friends
          will admire and appreciate your custom handmade item, as intended.
          Many of these custom handmade gifts are very personal and do not
          appear in our catalogue. Don't let what you see in our catalogue limit
          your creativity and inspiration. If you can dream it, Heartland
          Shoppes can help bring it to life.
        </p>
        <p style={{ marginBottom: 0 }}>
          We create t-shirt concepts for charity teams, clubs and small
          businesses. No order is to small for Heartland Shoppes. Our designs
          have shown up at Spin Classes, Charity T-Rex runs, our regional
          Neo-natal Unit, rare diseases month and similar worthwhile causes.
          Teams sporting our designs get noticed. Whether its a t-shirt and/or a
          water bottle, the competitors proudly display their custom handmade
          items, as they rise to the challenges ahead of them; as competitors
          and supporters of these events. Heartland Shoppes applauds all
          participants in these noble initiatives.
        </p>
        <p style={{ marginBottom: "8px", marginTop: "24px" }}>
          Want A Custom Product?
        </p>
        <Link to="/contact" className="item-links">
          <p>Request Product</p>
        </Link>
      </div>
    </div>
  );
}
