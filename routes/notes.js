


const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Middleware to check if user is logged in
// This function runs before any route that needs authentication.
// If the user is not logged in, redirect them to the login page.
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}

// === GET /notes ===
// List all notes for the logged-in user and render the pad UI.
// Notes are grouped by category (tag) for the dropdown.
router.get("/", requireLogin, async (req, res) => {
  try {
    // Find all notes for this user
    const notes = await Note.find({ user: req.session.userId });
    // Group notes by category for the dropdown, include _id and title for each note
    const tagsMap = {};
    notes.forEach(note => {
      const tag = note.category || 'untagged';
      if (!tagsMap[tag]) tagsMap[tag] = [];
      tagsMap[tag].push({ _id: note._id, title: note.title });
    });
    // Convert the tagsMap to an array for EJS rendering
    const tags = Object.keys(tagsMap).map(tag => ({ name: tag, notes: tagsMap[tag] }));
    // Render the pad UI with all tags and no note loaded
    res.render("notes/pad", { tags, note: null });
  } catch (err) {
    console.log(err);
    res.render("notes/pad", { tags: [], note: null, error: "Error loading notes." });
  }
});

// === GET /notes/new ===
// Show the form to create a new note.
router.get("/new", requireLogin, (req, res) => {
  res.render("notes/new", { error: undefined });
});

// === POST /notes ===
// Create a new note for the logged-in user.
router.post("/", requireLogin, async (req, res) => {
  try {
    // Get note data from the form
    const { title, body, category } = req.body;
    // Create a new Note document
    const newNote = new Note({
      title,
      body,
      category,
      user: req.session.userId
    });
    await newNote.save();
    // After saving, redirect to the notes list
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("notes/new", { error: "Error creating note." });
  }
});

// === GET /notes/get?id=... ===
// API endpoint to get a single note by its _id (used by the pad dropdown to load a note)
router.get("/get", requireLogin, async (req, res) => {
  try {
    // Get the note id from the query string
    const { id } = req.query;
    // Find the note for this user
    const note = await Note.findOne({ _id: id, user: req.session.userId });
    if (!note) return res.status(404).json({ error: "Note not found" });
    // Return the note data as JSON
    res.json({ category: note.category, title: note.title, body: note.body });
  } catch (err) {
    res.status(500).json({ error: "Error loading note" });
  }
});

// === GET /notes/:id/edit ===
// Show the edit form for a single note.
router.get("/:id/edit", requireLogin, async (req, res) => {
  try {
    // Find the note for this user
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      return res.render("notes/edit", { error: "Note not found." });
    }
    // Render the edit form with the note data
    res.render("notes/edit", { note });
  } catch (err) {
    console.log(err);
    res.render("notes/edit", { error: "Error loading edit form." });
  }
});

// === PUT /notes/:id ===
// Update an existing note for the logged-in user.
router.put("/:id", requireLogin, async (req, res) => {
  try {
    // Get updated note data from the form
    const { title, body, category } = req.body;
    // Find the note and update it
    await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { title, body, category }
    );
    // After updating, redirect to the notes list
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("notes/edit", { error: "Error updating note." });
  }
});

// === DELETE /notes/:id ===
// Delete a note for the logged-in user.
router.delete("/:id", requireLogin, async (req, res) => {
  try {
    // Find and delete the note for this user
    await Note.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    // After deleting, redirect to the notes list
    res.redirect("/notes");
  } catch (err) {
    console.log(err);
    res.render("notes/list", { error: "Error deleting note." });
  }
});

module.exports = router;
