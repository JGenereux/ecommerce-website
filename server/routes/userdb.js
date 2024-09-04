const router = require("express").Router();
const Users = require("../Models/users.models");
const bcrypt = require("bcrypt");

//check if user is in database
router.route("/").get(async (req, res) => {
  try {
    const userfound = await Users.find({ email: req.query.email });
    res.json(userfound);
  } catch (error) {
    res.status(400).json(error);
  }
});
//add user to database
router.route("/signup").post(async (req, res) => {
  async function hashPassword(password) {
    const saltRounds = 10; //higher = more secure
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  const hashedPassword = await hashPassword(req.body.password);
  //creates new user with hashed password and automatically gives them the role user.
  const newUser = {
    email: req.body.email,
    password: hashedPassword,
    role: "user",
  };

  try {
    const User = await Users(newUser);
    await User.save();
    res.json("User added successfully");
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

//allow user to login to database
router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if email exists
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //check if passwords are equal
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: "Server error" });
  }
});
module.exports = router;
