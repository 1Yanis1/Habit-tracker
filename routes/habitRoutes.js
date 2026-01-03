const express = require('express');
const router = express.Router();
const habitService = require('../services/habitServices'); // Увери се, че името на файла съвпада (със или без "s")

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
router.post('/add-habit', (req, res) => {
    habitService.createNewHabit(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Habit added!', habitId: result.insertId });
    });
});

module.exports = router;