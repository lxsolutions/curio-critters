

const express = require('express');
const router = express.Router();
const { getLearningMetricsForUser, getUserById } = require('../db');

// Get summary statistics for all users
router.get('/summary', async (req, res) => {
  try {
    if (!req.query.user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    // This would be more complex in a real implementation with proper user listing
    // For now, we'll just return a simple success message
    res.json({
      message: 'Analytics summary endpoint working',
      note: 'In a full implementation, this would provide aggregate statistics across all users'
    });
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get learning analytics for a specific user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const metrics = getLearningMetricsForUser(req.params.id);

    // Calculate overall performance
    let totalTopics = 0;
    let averageScore = 0;

    if (metrics.length > 0) {
      metrics.forEach(metric => {
        totalTopics++;
        averageScore += metric.average_score || 0;
      });
      averageScore /= metrics.length;
    }

    res.json({
      userId: req.params.id,
      username: user.username,
      grade: user.grade,
      learningMetrics: metrics,
      overallPerformance: {
        totalTopics,
        averageScore: parseFloat(averageScore.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
