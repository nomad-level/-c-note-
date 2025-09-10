// models/Note.js
// --------------------
// The Note model defines what a "note" looks like in the database.
// Each note has a title, body, category, and a link to the user who created it.
// --------------------

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true    // every note must have a title
  },
  body: { 
    type: String, 
    required: true    // this holds the note text (can be plain text or code)
  },
  category: { 
    type: String, 
    required: true    // e.g. "Python", "JavaScript", "General Notes"
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",      // links each note to the user who made it
    required: true
  }
});

// Turn schema into a model
module.exports = mongoose.model("Note", noteSchema);
