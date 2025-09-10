

const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// Notes Index (List All Notes for the logged-in user)
router.get("/", requireLogin, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.session.userId });
    res.render("notes/list", { notes });
  } catch (err) {
    console.log(err);
    res.render("notes/list", { error: "Error loading notes." });
  }
});

// New Note Form
router.get("/new", requireLogin, (req, res) => {
  res.render("notes/new", { error: undefined });
});

// Create New Note
router.post("/", requireLogin, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const newNote = new Note({
      title,
      body,
      category,
      user: req.session.userId
    });
    await newNote.save();
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("notes/new", { error: "Error creating note." });
  }
});

// Show a Single Note
router.get("/:id", requireLogin, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      return res.render("notes/show", { error: "Note not found." });
    }
    res.render("notes/show", { note });
  } catch (err) {
    console.log(err);
    res.render("notes/show", { error: "Error loading note." });
  }
});

// Edit Note Form
router.get("/:id/edit", requireLogin, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      return res.render("notes/edit", { error: "Note not found." });
    }
    res.render("notes/edit", { note });
  } catch (err) {
    console.log(err);
    res.render("notes/edit", { error: "Error loading edit form." });
  }
});

// Update Note
router.put("/:id", requireLogin, async (req, res) => {
  try {
    const { title, body, category } = req.body;
    await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { title, body, category }
    );
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("notes/edit", { error: "Error updating note." });
  }
});

// Delete Note
router.delete("/:id", requireLogin, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("notes/list", { error: "Error deleting note." });
  }
});

module.exports = router;
