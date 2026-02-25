const { Pool } = require('pg');

// Свързваме се с Neon
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const habitService = {
    
    getAllHabitsSummary: (callback) => {
        const sql = `
            SELECT 
                h.Habit_ID, 
                h.Description AS Habit, 
                h.Amount AS Amount,
                STRING_AGG(DISTINCT c.Firstname, ', ') AS Users
            FROM habit h
            JOIN customer c ON h.User_ID = c.Customer_ID
            GROUP BY h.Habit_ID, h.Description, h.Amount  
        `;
        db.query(sql, (err, res) => callback(err, res ? res.rows : null));
    },

    getAllCustomers: (callback) => {
        const sql = 'SELECT * FROM customer';
        db.query(sql, (err, res) => callback(err, res ? res.rows : null));
    },

    getHabitsByUserId: (userId, callback) => {
        
        const sql = 'SELECT * FROM habit WHERE User_ID = $1';
        db.query(sql, [userId], (err, res) => callback(err, res ? res.rows : null));
    },

    createNewHabit: (data, userId, callback) => {
    
    const sql = `
        INSERT INTO habit (user_id, description, frequency_type, amount, created_date) 
        VALUES ($1, $2, $3, $4, CURRENT_DATE) 
        RETURNING habit_id AS "insertId"
    `;

    
    db.query(sql, [userId, data.description, data.frequency, data.amount], (err, res) => {
        if (err) {
            console.error("Грешка при запис в Neon:", err);
            return callback(err, null);
        }
        
        callback(null, { insertId: res.rows[0].insertId });
    });
    },

    deleteHabit: (id, callback) => {
        const sql = 'DELETE FROM habit WHERE Habit_ID = $1';
        db.query(sql, [id], (err, res) => callback(err, res ? res : null));
    },

    updateHabit: (id, data, callback) => {
        const sql = 'UPDATE habit SET Description = $1, Frequency_type = $2, Amount = $3 WHERE Habit_ID = $4';
        db.query(sql, [data.description, data.frequency, data.amount, id], (err, res) => callback(err, res ? res : null));
    },

    completeHabit: (habitId, callback) => {
    const sql = `
        UPDATE habit 
        SET 
            streak_count = CASE 
                WHEN last_completed_date = CURRENT_DATE THEN streak_count
                WHEN last_completed_date = CURRENT_DATE - INTERVAL '1 day' THEN streak_count + 1
                ELSE 1
            END,
            completion_history = array_append(completion_history, CURRENT_DATE),
            last_completed_date = CURRENT_DATE
        WHERE Habit_ID = $1 
        AND (last_completed_date IS NULL OR last_completed_date < CURRENT_DATE)
        RETURNING streak_count, completion_history;
    `;

    db.query(sql, [habitId], (err, res) => {
        if (err) return callback(err, null);
        if (res.rowCount === 0) return callback(new Error("Вече сте отбелязали този навик за днес!"), null);
        callback(null, res.rows[0]);
    });
    },
    
};

module.exports = habitService;