const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const authService = {
    
    registerUser: (username, plainPassword, callback) => {
        bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
            if (err) return callback(err);

           
            const sql = 'INSERT INTO customer (Firstname, Password, Email) VALUES ($1, $2, $3) RETURNING Customer_ID';
            
            
            db.query(sql, [username, hash, `${username}@example.com`], (err, res) => {
                if (err) return callback(err);
                callback(null, res.rows[0]);
            });
        });
    },

    
    loginUser: (username, plainPassword, callback) => {
        
        const sql = 'SELECT * FROM customer WHERE Firstname = $1';
        
        db.query(sql, [username], (err, res) => {
            if (err) return callback(err);
            if (res.rows.length === 0) return callback(null, false);

            const user = res.rows[0];
            const storedHash = user.password;

            bcrypt.compare(plainPassword, storedHash, (err, isMatch) => {
                if (err) return callback(err);
                
                if (isMatch) {
                    
                    callback(null, user);
                } else {
                    callback(null, false);
                }
            });
        });
    }
};

module.exports = authService;