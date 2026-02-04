const db = require('../db/connection'); 

const habitService = {
    
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

    
    getAllCustomers: (callback) => {
        const sql = 'SELECT * FROM customer';
        db.query(sql, callback);
    },

    
    createNewHabit: (data, callback) => {
        const sql = 'INSERT INTO habit (User_ID, Description, Frequency_type, Amount, Created_date) VALUES (?, ?, ?, ?, CURDATE())';
        db.query(sql, [data.user_id, data.description, data.frequency, data.amount], callback);
    },

    getHabitsByUserId: (userId, callback) => {
        const sql = 'SELECT * FROM habit WHERE User_ID = ?';
        db.query(sql, [userId], callback);
    },

    createNewHabit: (data, userId, callback) => {
        const sql = 'INSERT INTO habit (User_ID, Description, Frequency_type, Amount, Created_date) VALUES (?, ?, ?, ?, CURDATE())';
        
        db.query(sql, [userId, data.description, data.frequency, data.amount], callback);
    },

    
    deleteHabit: (id, callback) => {
        const sql = 'DELETE FROM habit WHERE Habit_ID = ?';
        db.query(sql, [id], callback);
    },

    
    updateHabit: (id,data, callback) => {
        const sql = 'UPDATE habit SET Description = ?, Frequency_type = ?,Amount = ? WHERE Habit_ID = ?';
        db.query(sql, [data.description, data.frequency, data.amount, id], callback);
    }
};


module.exports = habitService;