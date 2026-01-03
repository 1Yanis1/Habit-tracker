const mysql = require('mysql2');
require('dotenv').config();
 

// Създаваме връзката
const db = mysql.createConnection({
    host: process.env.HOST_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
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