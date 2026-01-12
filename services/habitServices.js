const db = require('../db/connection'); 

const habitService = {
    // Вземане на всички навици с групиране и количество
    getAllHabitsSummary: (callback) => {
        const sql = `
            SELECT 
                h.Habit_ID, 
                h.Description AS Habit, 
                h.Amount AS Amount,
                GROUP_CONCAT(DISTINCT c.Firstname SEPARATOR ', ') AS Users
            FROM habit h
            JOIN customer c ON h.User_ID = c.Customer_ID
            GROUP BY h.Habit_ID, h.Description, h.Amount  
`;
        db.query(sql, callback);
    },

    // Вземане на всички клиенти
    getAllCustomers: (callback) => {
        const sql = 'SELECT * FROM customer';
        db.query(sql, callback);
    },

    // Добавяне на нов навик
    createNewHabit: (data, callback) => {
        const sql = 'INSERT INTO habit (User_ID, Description, Frequency_type, Amount, Created_date) VALUES (?, ?, ?, ?, CURDATE())';
        db.query(sql, [data.user_id, data.description, data.frequency, data.amount], callback);
    },

    // Изтриване на навик
    deleteHabit: (id, callback) => {
        const sql = 'DELETE FROM habit WHERE Habit_ID = ?';
        db.query(sql, [id], callback);
    },

    // Актуализиране на навик
    updateHabit: (id,data, callback) => {
        const sql = 'UPDATE habit SET Description = ?, Frequency_type = ?,Amount = ? WHERE Habit_ID = ?';
        db.query(sql, [data.description, data.frequency, data.amount, id], callback);
    }
};


module.exports = habitService;