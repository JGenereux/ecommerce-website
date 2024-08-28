const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

//middlewares
app.use(cors()); //allows for cross origin resource sharing between servers different than this one.
app.use(express.json()); //allows for parsing of jsons.

//connect to database
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB server connected");
});

//import database for inventory
const inventoryRouter = require("./routes/inventory");
//import database for images
const imageRouter = require("./routes/images");
//import stripe api payment route
const stripeRouter = require("./routes/checkout");
app.use("/inventory", inventoryRouter);
app.use("/image", imageRouter);
app.use("/checkout", stripeRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
