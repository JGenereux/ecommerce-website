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
  try {
    //need to create an object with all properties in inventory.models schema
    //Saves item to database
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.json("User Added");
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

//Route to update a specific item in database
router.route("/delete").post(async (req, res) => {
  try {
    await Inventory.deleteOne({ itemName: req.body.itemName });
    res.json("Item Removed Successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json("Error: " + err);
  }
});

module.exports = router;
