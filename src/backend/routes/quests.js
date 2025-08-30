

const express = require('express');
const router = express.Router();
const { getAllQuests, getQuestById, addQuest } = require('../db');

// Get all available quests
router.get('/', async (req, res) => {
  try {
    const quests = getAllQuests();
    res.json(quests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single quest by ID
router.get('/:id', async (req, res) => {
  try {
    const quest = getQuestById(req.params.id);
    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }
    res.json(quest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new quest
router.post('/', async (req, res) => {
  try {
    const newQuest = addQuest(req.body);
    res.status(201).json(newQuest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

