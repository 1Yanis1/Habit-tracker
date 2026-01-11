const express = require('express');
const router = express.Router();
const habitService = require('../services/habitServices'); 

// 1. Маршрут за навиците (вече го имаш)
router.get('/habits', (req, res) => {
    habitService.getAllHabitsSummary((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. НОВИЯТ Маршрут за клиентите - ДОБАВИ ГО ТУК
router.get('/customers', (req, res) => {
    habitService.getAllCustomers((err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 3. Маршрут за добавяне (ако го имаш)
router.post('/habits', (req, res) => {
    habitService.createNewHabit(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit added!', habitId: result.insertId });
    });
});

router.delete('/habits/:id', (req, res) => {
    const habitID = req.params.id;
    habitService.deleteHabit(habitID, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit deleted!' });
    });
});

router.put('/habits/:id', (req, res) => {
    const habitID = req.params.id;
    habitService.updateHabit(habitID, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit updated!' });
    });
});

module.exports = router;