import { useState } from "react";
import { useAuth } from "./authcontext";
import "../../styles/home.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import shopLogo from "../../Images/navbarLogo.png";

export default function LoginPage() {
  return (
    <div className="loginpage-container">
      <LoginUI />
    </div>
  );
}

function LoginUI() {
  return (
    <div className="login-formcontainer">
      <img
        src={shopLogo}
        alt="Heartland Shoppes Logo"
        style={{
          height: "80px",
          width: "80px",
          border: "2px dashed black",
          alignSelf: "center",
          borderRadius: "45px",
        }}
        className="login-image"
      ></img>
      <h2 className="login-heading">Login</h2>
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const checkCredentials = async () => {
    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        "https://heartland-shoppes-server.vercel.app/users/login/",
        user
      );

      //On response 200, login will have been successful so set user's adjacent role.
      const role = response.data.user.role;
      return { success: true, role };
    } catch (error) {
      //check if issue is occuring in the backend with checking user's info.
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const message = error.response.data.message;
        if (message === "User not found") {
          alert("User not found");
        } else {
          alert("Invalid Credentials");
        }
        return { success: false };
      } else {
        //if issue isn't related to the backend
        alert("Error occured with server, please try again");
        return { success: false };
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //returns object with success boolean value and role value if success boolean is true.
    const isValidUser = await checkCredentials();
    if (!isValidUser.success) return;

    //returns true if user is successfully logged in
    const success = await login(email, password, isValidUser.role);
    if (success) {
      navigate("/", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-inputgroup">
        <label htmlFor="email" className="logintextlabel">
          Email address
        </label>
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
      </div>
      <div className="form-inputgroup">
        <label htmlFor="password" className="logintextlabel">
          Password
        </label>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
      </div>
      <button type="submit" className="loginbtn">
        Login
      </button>
      <p className="signupText">
        No account? <Link to="/signup"> Signup</Link>
      </p>
    </form>
  );
}
