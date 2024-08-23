const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
