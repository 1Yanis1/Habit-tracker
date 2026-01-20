const express = require('express');
const router = express.Router();
const habitService = require('../services/habitServices');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/habits', authenticateToken, (req, res) => {
    const userId = req.user.id;
    habitService.getHabitsByUserId(userId, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/habits', authenticateToken, (req, res) => {
    const userId = req.user.id;
    habitService.createNewHabit(req.body, userId, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit added!', habitId: result.insertId });
    });
});

router.delete('/habits/:id', authenticateToken, (req, res) => {
    const habitID = req.params.id;
    habitService.deleteHabit(habitID, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit deleted!' });
    });
});

router.put('/habits/:id', authenticateToken, (req, res) => {
    const habitID = req.params.id;
    habitService.updateHabit(habitID, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit updated!' });
    });
});

module.exports = router;