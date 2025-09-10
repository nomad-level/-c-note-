// routes/auth.js
// --------------------
// This file handles user signup, login, and logout
// --------------------

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// --------------------
// Signup Routes
// --------------------

// Show signup form
router.get("/signup", (req, res) => {
  res.render("auth/signup"); // renders views/auth/signup.ejs
});

// Handle signup form
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Log the user in automatically
    req.session.userId = newUser._id;

    res.redirect("/notes"); // go to notes dashboard
  } catch (err) {
    console.log(err);
    res.send("Error signing up. Try again.");
  }
});

// --------------------
// Login Routes
// --------------------

// Show login form
router.get("/login", (req, res) => {
  res.render("auth/login"); // renders views/auth/login.ejs
});

// Handle login form
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user in DB
    const user = await User.findOne({ username });
    if (!user) {
      return res.send("User not found.");
    }

    // Compare entered password with hashed password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.send("Invalid password.");
    }

    // Store user session
    req.session.userId = user._id;

    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.send("Error logging in. Try again.");
  }
});

// --------------------
// Logout Route
// --------------------
router.get("/logout", (req, res) => {
  req.session.destroy(); // clears the session
  res.redirect("/login");
});

module.exports = router;
