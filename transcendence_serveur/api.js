const express = require('express');
const router = express.Router();
const { updateScores } = require('./game');

router.get('/', (req, res) => {
  console.log("API called");
});

router.post('/scores', (req, res) => {
  const scores = updateScores(req.body);
  res.json(scores);
});

module.exports = router;
