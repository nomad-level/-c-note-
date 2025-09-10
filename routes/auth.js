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


// Signup Routes
router.get("/signup", (req, res) => {
  res.render("auth/signup", { error: undefined });
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("auth/signup", { error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    req.session.userId = newUser._id;
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("auth/signup", { error: "Error signing up. Try again." });
  }
});

// --------------------
// Login Routes
// --------------------


// Login Routes
router.get("/login", (req, res) => {
  res.render("auth/login", { error: undefined });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("auth/login", { error: "User not found." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.render("auth/login", { error: "Invalid password." });
    }
    req.session.userId = user._id;
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("auth/login", { error: "Error logging in. Try again." });
  }
});


// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
