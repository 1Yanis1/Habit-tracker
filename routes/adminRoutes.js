const exrpess = require('express');
const router = exrpess.Router();
const db = require('../db/connection');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const isAdmin = (req, res, next) => {
    const token = req.cookies.token;    
    if (!token) return res.status(401).json({ error: 'Няма достъп'});

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Нямате права' });
        }
        req.user = decoded;
        next(); 
    });
};

router.get('/stats', isAdmin, (req, res) => {
    const sqlUsers = 'SELECT COUNT(*) as total FROM users';
    
    db.query(sqlUsers, (err, results) => {
        let userCount = 0;
        if (!err && results.length > 0) {
            userCount = results[0].total;
        }

        res.json({
            totalUsers: userCount,
            totalHabits: 0,
            chartLabels: ['Старт'],
            chartData: [userCount]
        });
    });
});

router.get('/me', isAdmin, (req, res) => {
    const sql = 'SELECT username, profile_picture FROM users WHERE id = ?';
    db.query(sql, [req.user.id], (err, results) => {
        if (err || results.length === 0) {
            return res.json({ username: 'Admin', profile_picture: '' });
        }
        res.json(results[0]);
    });
});

router.get('/users', isAdmin, (req, res) => { 
    db.query('SELECT id, username, role FROM users', (err, results) => {
        if (err) return res.json([]);
        res.json(results);
    });
});

router.get('/habits', isAdmin, (req, res) => {
    
    const sql = 'SELECT * FROM habits'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Грешка в DB:", err);
            return res.status(500).json({ error: err.message });
        }
        
        res.json(results); 
    });
});
    
module.exports = router;