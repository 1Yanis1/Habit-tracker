const mysql = require('mysql2');

// Създаваме връзката
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', 
    database: 'HabitTracker'
});

// Свързваме се
db.connect((err) => {
    if (err) {
        console.error('Грешка при свързване с MySQL:', err);
        return;
    }
    console.log('Успешно свързване с базата данни (от модула db)!');
});

// Това е най-важното - позволява на другите файлове да ползват тази връзка
module.exports = db;