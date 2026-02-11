require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch'); 
const app = express();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
     }
});

const API_KEY = process.env.API_KEY; 
const GEMINI_URL = process.env.GEMINI_URL; 

const habitRoutes = require('./routes/habitRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

pool.connect((err, client, release) => {
    if (err) return console.error('Грешка при свързване с базата данни', err.stack);
    console.log('Успешно свързване с базата данни');
    release();
});

// МАРШРУТ ЗА ЧАТБОТА - ДИРЕКТНА ВРЪЗКА
app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userMessage }] }]
            })
        });

        const data = await response.json();

        // Проверка за грешка от Google
        if (data.error) {
            console.error("Google Error:", data.error);
            return res.status(500).json({ reply: "Грешка от Google: " + data.error.message });
        }

        const botReply = data.candidates[0].content.parts[0].text;
        res.json({ reply: botReply });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ reply: "Сървърна грешка. Провери конзолата!" });
    }
});

app.use(habitRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сървърът работи на http://localhost:${PORT}/login.html`);
});