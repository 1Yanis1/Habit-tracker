const express = require('express');
const app = express();
const habitRoutes = require('./routes/habitRoutes'); // Вземаме подредените маршрути

// Настройки (Middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // За твоя index.html

// Използваме маршрутите
app.use(habitRoutes);

// Начална страница (вече я сервираме от public/index.html)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сървърът работи на http://localhost:${PORT}`);
});