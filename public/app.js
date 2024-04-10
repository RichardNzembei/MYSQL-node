const express = require('express');
const mysql = require('mysql');
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'robin',
    password: 'Richie@innit4',
    database: 'expensedb'
});

db.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log("Connection successful");
    }
});

app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to handle adding expenses
app.post('/add-expense', (req, res) => {
    // Log the request payload
    console.log('Request payload:', req.body);

    const { name, amount } = req.body;

    // Execute the SQL query to insert expense into database
    const sql = 'INSERT INTO expenses (name, amount) VALUES (?, ?)';
    const data = [name, amount ];

    db.query(sql, data, (err, results) => {
        if (err) {
            console.error('Error adding expense to database:', err);
            res.status(500).json({ message: 'Error adding expense to database' });
            return;
        }

        res.status(200).json({ message: 'Expense added successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
