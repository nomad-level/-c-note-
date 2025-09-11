// models/User.js
// --------------------
// The User model defines what a "user" looks like in our database.
// Each user will have an email and a password (stored securely).
// --------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,    // every user must have an email
    unique: true,      // no duplicate emails allowed
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  password: { 
    type: String, 
    required: true     // every user must have a password
  }
});

// Turn schema into a model
module.exports = mongoose.model("User", userSchema);
