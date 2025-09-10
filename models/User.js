// models/User.js
// --------------------
// The User model defines what a "user" looks like in our database.
// Each user will have a username and a password (stored securely).
// --------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,    // every user must have a username
    unique: true       // no duplicate usernames allowed
  },
  password: { 
    type: String, 
    required: true     // every user must have a password
  }
});

// Turn schema into a model
module.exports = mongoose.model("User", userSchema);
