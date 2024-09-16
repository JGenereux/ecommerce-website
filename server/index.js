const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors()); //allows for cross origin resource sharing between servers different than this one.
app.use(express.json()); //allows for simple json parsing.

//connect to database
const url = process.env.ATLAS_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB server connected");
});

//import database for inventory
const inventoryRouter = require("./routes/inventory");
//import database for images
const imageRouter = require("./routes/images");
//import catabase for users
const usersRouter = require("./routes/userdb");
//import database for reviews
const reviewsRouter = require("./routes/reviews");
//import stripe api payment route
const stripeRouter = require("./routes/checkout");
//import email api
const emailRouter = require("./routes/emails");

app.use("/inventory", inventoryRouter);
app.use("/image", imageRouter);
app.use("/users", usersRouter);
app.use("/checkout", stripeRouter);
app.use("/reviews", reviewsRouter);
app.use("/semail", emailRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
