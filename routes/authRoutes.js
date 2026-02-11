const express = require('express');
const router = express.Router();
const authService = require('../services/authServices');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super_secret_key_12345';

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    authService.registerUser(username, password, (err, result) => {
        if (err) return res.status(500).json({ error: 'Грешка при регистрация' });
        res.json({ message: 'Успешна регистрация!' });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    authService.loginUser(username, password, (err, user) => {
        if (err) return res.status(500).json({ error: 'Сървърна грешка' });
        if (!user) return res.status(401).json({ error: 'Грешно име или парола' });

        
        
        const token = jwt.sign(
            { id: user.customer_id || user.customer_id }, 
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
    );

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, 
            maxAge: 7200000 
        });

        
        res.cookie('role', user.role, {
            httpOnly: false, 
            maxAge: 7200000
        });

       
        res.json({ 
            message: 'Успешен вход!', 
            user: user.username, 
            role: user.role 
        });
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('role'); 
    res.json({ message: 'Излязохте успешно' });
});

module.exports = router;