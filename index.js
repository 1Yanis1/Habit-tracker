const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const habitRoutes = require('./routes/habitRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(habitRoutes);
app.use(authRoutes);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сървърът работи на http://localhost:${PORT}`);
});