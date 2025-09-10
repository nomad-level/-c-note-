// server.js
// --------------------
// This is the main entry point of the app
// It sets up Express, MongoDB, middleware, and routes
// --------------------

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");

const app = express();

// --------------------
// Middleware setup
// --------------------

// Parse form data (so we can read POST form submissions)
app.use(express.urlencoded({ extended: true }));

// Method override allows us to use PUT and DELETE in forms
app.use(methodOverride("_method"));

// Setup sessions (to keep users logged in)
app.use(session({
  secret: "notepadsecret", // change this in production
  resave: false,
  saveUninitialized: true
}));

// Set the view engine to EJS (so we can use .ejs files)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --------------------
// MongoDB connection
// --------------------
mongoose.connect("mongodb://127.0.0.1:27017/digitalNotepad")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

// --------------------
// Routes
// --------------------
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

// Homepage route
const Note = require("./models/models/Note");
app.get("/", async (req, res) => {
  try {
    const quotes = await Note.find({}) || [];
    res.render("index", { quotes }); // render views/index.ejs with quotes
  } catch (err) {
    console.log(err);
    res.render("index", { quotes: [] });
  }
});

// Use our route files
app.use("/", authRoutes);
app.use("/notes", noteRoutes);

// --------------------
// Start the server
// --------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
