


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
// Render the new pad.ejs as the main notes view after login
router.get("/", requireLogin, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.session.userId });
          // Group notes by category for the dropdown, include _id and title for each note
    const tagsMap = {};
    notes.forEach(note => {
      const tag = note.category || 'untagged';
      if (!tagsMap[tag]) tagsMap[tag] = [];
            tagsMap[tag].push({ _id: note._id, title: note.title });
    });
  const tags = Object.keys(tagsMap).map(tag => ({ name: tag, notes: tagsMap[tag] }));
  res.render("notes/pad", { tags, note: null });
  } catch (err) {
    console.log(err);
    res.render("notes/pad", { tags: [], note: null, error: "Error loading notes." });
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
// API endpoint to get a note by _id (for pad dropdown)
router.get("/get", requireLogin, async (req, res) => {
  try {
    const { id } = req.query;
    const note = await Note.findOne({ _id: id, user: req.session.userId });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ category: note.category, title: note.title, body: note.body });
  } catch (err) {
    res.status(500).json({ error: "Error loading note" });
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
