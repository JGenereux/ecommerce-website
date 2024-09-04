import { useState } from "react";
import office from "../Images/office.jpg";
import cup from "../Images/impcup.jpg";
import specItem from "../Images/impitem.jpg";
import Navbar from "../Components/navbar/navbar";

export default function About() {
  return (
    <div>
      <Navbar />
      <ImageSlider />
    </div>
  );
}

function ImageSlider() {
  const images = [
    "This is my office/workspace",
    "Working on a tumbler for a client. It is currently on the spinner. Will be shipped out in a few days.",
    "Getting ready for Christmas Eve and the arrival of the man in red. You guessed it Santa and the crew.",
  ];
  //State to display current image based on the button clicked,
  //default picture is office
  const [currentImage, setCurrentImage] = useState(office);
  const [description, setDescription] = useState(images[0]);

  function handleChange(image) {
    setCurrentImage(image);

    if (image === office) {
      setDescription(images[0]);
    } else if (image === cup) {
      setDescription(images[1]);
    } else {
      setDescription(images[2]);
    }
  }
  return (
    <div className="about-container">
      <h3 className="about-title">My Journey</h3>
      <div className="about-info">
        <img src={currentImage} alt={description}></img>
        <div className="button-container">
          <button onClick={() => handleChange(office)}></button>
          <button onClick={() => handleChange(cup)}></button>
          <button onClick={() => handleChange(specItem)}></button>
        </div>
      </div>
      <p className="aboutitem-description">{description}</p>
      <h2>Everything made from the Heart. Handmade with love.</h2>
      <p className="about-description">
        I decided in October 2017, that I wanted to get back into crafting. It
        has changed a lot and the possibilities are endless. I have called my
        shop Heartlandshoppes as I want to help people celebrate moments in
        their lives. Made from the heart. I have a lot of new ideas coming to my
        Heartlandshoppes so stay tuned. I’m very excited about what is to come.
        I am leaning toward family heirlooms. If you have a design idea in mind,
        ask: I maybe able to get it done for you. I enjoy the process of
        creating from start to the finish.
      </p>
    </div>
  );
}
