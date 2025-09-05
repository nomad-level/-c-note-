// ================================
// Import dependencies
// ================================
const express = require("express")   // framework to handle routes
const mongoose = require("mongoose") // helps us talk to MongoDB
const methodOverride = require("method-override") // lets us use PUT & DELETE in forms
const path = require("path")         // helps with file paths
require("dotenv").config()           // loads .env file (for MongoDB connection string)

const app = express()                // create our Express app
const PORT = process.env.PORT || 3000

// ================================
// Middleware setup
// ================================
app.set("view engine", "ejs")                       // tells Express to use EJS templates
app.set("views", path.join(__dirname, "views"))     // where our EJS files live
app.use(express.urlencoded({ extended: true }))     // parse form data (req.body)
app.use(methodOverride("_method"))                  // look for ?_method=PUT/DELETE in forms

// ================================
// Database connection
// ================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err))

// ================================
// Schema & Model (Quotes)
// ================================
// Think of this as the "blueprint" for one Quote
const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },     // what the quote says
  author: { type: String, required: true },   // who said it
})

// Turn schema into a model so we can actually use it
const Quote = mongoose.model("Quote", quoteSchema)

// ================================
// Routes
// ================================

// Home route - redirect to /quotes
app.get("/", (req, res) => {
  res.redirect("/quotes")
})

// INDEX - show all quotes
app.get("/quotes", async (req, res) => {
  const quotes = await Quote.find()
  res.render("index", { quotes }) // pass quotes to index.ejs
})

// NEW - show form to create a quote
app.get("/quotes/new", (req, res) => {
  res.render("new")
})

// CREATE - add new quote to DB
app.post("/quotes", async (req, res) => {
  await Quote.create(req.body)
  res.redirect("/quotes") // go back to all quotes
})

// SHOW - show one quote by ID
app.get("/quotes/:id", async (req, res) => {
  const quote = await Quote.findById(req.params.id)
  res.render("show", { quote })
})

// EDIT - show form to edit a quote
app.get("/quotes/:id/edit", async (req, res) => {
  const quote = await Quote.findById(req.params.id)
  res.render("edit", { quote })
})

// UPDATE - update a quote
app.put("/quotes/:id", async (req, res) => {
  await Quote.findByIdAndUpdate(req.params.id, req.body)
  res.redirect("/quotes")
})

// DELETE - remove a quote
app.delete("/quotes/:id", async (req, res) => {
  await Quote.findByIdAndDelete(req.params.id)
  res.redirect("/quotes")
})

// ================================
// Start server
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
