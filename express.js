const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a connection 
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'robin',
    password: 'Richie@innit4',
    database: 'expensedb'
});

// Middleware to parse JSON data
app.use(express.json());

// Serve static files (CSS, JavaScript, etc.)
app.use(express.static('public'));

// Route to handle adding expenses
app.post('/add-expense', (req, res) => {
    const { expenseName, expenseAmount } = req.body;

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL database connection:', err);
            res.status(500).json({ message: 'Error getting database connection' });
            return;
        }

        // Execute the SQL query to insert expense into database
        const sql = 'INSERT INTO expenses (name, amount) VALUES (?, ?)';
        connection.query(sql, [expenseName, expenseAmount], (err, results) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error adding expense to database:', err);
                res.status(500).json({ message: 'Error adding expense to database' });
                return;
            }

            
            res.status(200).json({ message: 'Expense added successfully' });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
