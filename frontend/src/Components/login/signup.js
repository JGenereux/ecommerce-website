import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="loginpage-container">
      <SignupUI />
    </div>
  );
}

function SignupUI() {
  return (
    <div className="login-formcontainer">
      <h2 className="login-heading">Sign Up</h2>
      <SignupForm />
    </div>
  );
}

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function checkEmail(username) {
    try {
      const response = await axios.get(
        `http://localhost:5000/users?email=${username}`
      );
      const foundEmail = response.data;

      if (Object.keys(foundEmail).length === 0) {
        return false;
      }

      if (foundEmail[0]["email"] === username) {
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    //check if email is valid
    if (!email.includes("@") || !email.includes(".")) {
      alert("Make sure email is valid");
      return;
    }
    if (password.length < 8) {
      alert("Make sure password is over 8 characters");
      return;
    }

    const userExists = await checkEmail(email);

    if (userExists) {
      alert("User already exists");
      return;
    }

    //create new user, password is hashed in the backend
    const newUser = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/users/signup",
        newUser
      );

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-inputgroup">
          <label htmlFor="email" className="logintextlabel">
            Email address
          </label>
          <input
            id="email"
            type="text"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
        </div>
        <div className="form-inputgroup">
          <label htmlFor="password" className="logintextlabel">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          ></input>
        </div>
        <button type="submit" className="loginbtn">
          Create account
        </button>
      </form>
    </div>
  );
}
