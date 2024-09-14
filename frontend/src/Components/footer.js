import "../styles/home.css";
import fblogo from "../Images/fblogo.png";
import iglogo from "../Images/iglogo.png";
import navbarlogo from "../Images/navbarLogo.png";

export default function Footer() {
  return (
    <div className="footer-container">
      <img
        className="footer-mainLogo"
        src={navbarlogo}
        alt="Heartland Shoppes Logo"
      ></img>
      <h3 className="footer-text">Connect With Me</h3>
      <div className="footer-icons">
        <a href="https://www.facebook.com/DonnaHeartlandShoppes">
          <img src={fblogo} alt="facebook logo"></img>
        </a>
        <a href="https://www.instagram.com/heartlandshoppes.etsy/">
          <img src={iglogo} alt="instagram logo"></img>
        </a>
      </div>
    </div>
  );
}
