//Initializes router and inventory as the schema for inventory
const router = require("express").Router();
const Inventory = require("../Models/inventory.model.js");

//default path to get all info in db
router.route("/").get(async (req, res) => {
  try {
    const inv = await Inventory.find();
    res.json(inv);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

//path to get info on a certain item
router.route("/:name").get(async (req, res) => {
  try {
    const info = await Inventory.findOne({ itemName: req.params.name });
    res.json(info);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

//path to query items based on the user's substring (so full name is not required)
router.route("/substr/:name").get(async (req, res) => {
  try {
    const items = await Inventory.find({
      itemName: { $regex: req.params.name, $options: "i" },
    });
    res.json(items);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

//add info to database
router.route("/add").post(async (req, res) => {
  //need to create an object with all properties in inventory.models schema
  const itemName = req.body.itemName;
  const category = req.body.category;
  const price = Number(req.body.price);
  const quantity = Number(req.body.quantity);
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const newItem = new Inventory({
    itemName,
    category,
    price,
    quantity,
    imageUrl,
    description,
  });

  //Saves item to database
  try {
    await newItem.save();
    res.json("User Added");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
