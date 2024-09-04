const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Users = new mongoose.model("users", usersSchema);

module.exports = Users;
