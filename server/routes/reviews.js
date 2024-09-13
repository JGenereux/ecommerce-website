const router = require("express").Router();
const Reviews = require("../Models/reviews.model");

//add review to database
router.route("/create").post(async (req, res) => {
  try {
    //creates a new review with the items provided in the post request
    //Should contain a itemName, username, rating, & comment.
    const newReview = await Reviews(req.body);
    await newReview.save();
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});
//get reviews for a specific item from database
router.route("/:itemname").get(async (req, res) => {
  try {
    //finds all items in the database that belong to that specific item
    const reviews = await Reviews.find({ itemName: req.params.itemname });
    res.json(reviews);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});
//update review in database

//remove review from database
router.route("/remove/:username").delete(async (req, res) => {
  try {
    const review = await Reviews.findOneAndDelete({
      userName: req.params.username,
    });

    if (!review) {
      return res.status(400).json("Error: " + error);
    }
    res.json(review);
  } catch (error) {
    res.status(400).json("Error: " + error);
  }
});

module.exports = router;
