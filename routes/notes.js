// Placeholder for notes routes. Please implement your notes routes here.
const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Notes route works!');
});

module.exports = router;
