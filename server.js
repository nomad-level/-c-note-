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


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(session({
  secret: "notepadsecret",
  resave: false,
  saveUninitialized: false
}));

// Make session userId available to all views
app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});
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
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", authRoutes);
app.use("/notes", noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
