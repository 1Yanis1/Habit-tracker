const db = require('../db/connection');
const bcrypt = require('bcrypt'); 
const saltRounds = 10; 

const authService = {
    
    
    registerUser: (username, plainPassword, callback) => {
        bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
            if (err) {
                return callback(err);
            }
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(sql, [username, hash], (err, result) => {
                if (err) return callback(err);
                callback(null, result);
            });
        });
    },

    
    loginUser: (username, plainPassword, callback) => {
        
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, false); 

            const user = results[0];
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