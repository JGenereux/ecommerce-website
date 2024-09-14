import Navbar from "../navbar/navbar";
import Footer from "../footer";
import contactbg from "../../Images/contactbg.jpg";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <div style={{ position: "absolute" }}>
        <img
          src={contactbg}
          alt="wood background"
          style={{
            height: "100%",
            width: "100%",
            maxHeight: "1080px",
            maxWidth: "1920px",
            filter: "blur(3px)",
            zIndex: "-1",
          }}
        ></img>
      </div>
      <div className="contact-container">
        <Form />
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="contactForm">
      <form className="contactForm-container">
        <label htmlFor="name">NAME *</label>
        <input type="text" id="name" required></input>
        <label htmlFor="email">EMAIL *</label>
        <input type="email" id="email" required></input>
        <label htmlFor="subject">SUBJECT *</label>
        <input type="text" id="subject" required></input>
        <label htmlFor="question">YOUR MESSAGE *</label>
        <textarea id="question" required></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
