const mongoose = require("mongoose");
const assert = require("assert");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 250,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    // match: /	^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
  },

  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,

    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
