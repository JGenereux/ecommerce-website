//Schema for review database
//Each review is a row
//The columns are itemname, name, rating, comment
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    itemName: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Reviews = mongoose.model("Reviews", ReviewSchema);
module.exports = Reviews;
