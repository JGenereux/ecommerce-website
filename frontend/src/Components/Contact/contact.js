import Navbar from "../navbar/navbar";
import Footer from "../footer";
import contactbg from "../../Images/contactbg.jpg";
import { useState } from "react";
import axios from "axios";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  async function handleSendEmail() {
    const newEmail = {
      email: email,
      subject: subject,
      text: text,
    };

    try {
      await axios.post("http://localhost:5000/semail", newEmail);
    } catch (error) {
      window.alert(error);
    }
  }

  return (
    <div className="contactForm">
      <form className="contactForm-container" onSubmit={handleSendEmail}>
        <label htmlFor="name">NAME *</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        ></input>
        <label htmlFor="email">EMAIL *</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <label htmlFor="subject">SUBJECT *</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        ></input>
        <label htmlFor="text">YOUR MESSAGE *</label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
