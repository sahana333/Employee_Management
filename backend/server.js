const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Create connection to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Welcometocit#1',  // Replace with your actual password
    database: 'employee_db',  // Replace with your actual database name
});

// Check MySQL connection
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database!');
});

// Define POST route for adding employees
app.post('/api/employees', (req, res) => {
    const { employeeName, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;

    // Check for missing fields
    if (!employeeName || !employeeId || !email || !phoneNumber || !department || !dateOfJoining || !role) {
        return res.status(400).send('All fields are required');
    }

    const query = `INSERT INTO employees (employeeName, employeeId, email, phoneNumber, department, dateOfJoining, role)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [employeeName, employeeId, email, phoneNumber, department, dateOfJoining, role], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err.message);
            return res.status(500).send('Database insertion error');
        }
        res.status(200).send({ message: 'Employee added successfully', data: result });
    });
});

// Define GET route to fetch all employees
app.get('/', (req, res) => {
    const query = 'SELECT * FROM employees'; // SQL query to fetch all employees

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving data:', err.message);
            return res.status(500).send('Error retrieving data from the database');
        }
        res.status(200).json(results); // Send the retrieved data as JSON response
    });
});

// Define PUT route to update an employee
app.put('/api/employees/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    const { employeeName, email, phoneNumber, department, dateOfJoining, role } = req.body;

    // Validate input
    if (!employeeName || !email || !phoneNumber || !department || !dateOfJoining || !role) {
        return res.status(400).send('All fields are required');
    }

    const query = `UPDATE employees SET 
                    employeeName = ?, 
                    email = ?, 
                    phoneNumber = ?, 
                    department = ?, 
                    dateOfJoining = ?, 
                    role = ? 
                   WHERE employeeId = ?`;

    db.query(
        query,
        [employeeName, email, phoneNumber, department, dateOfJoining, role, employeeId],
        (err, result) => {
            if (err) {
                console.error('Error updating employee:', err.message);
                return res.status(500).send('Database update error');
            }
            if (result.affectedRows === 0) {
                return res.status(404).send('Employee not found');
            }
            res.status(200).send({ message: 'Employee updated successfully' });
        }
    );
});

// Backend DELETE route definition
app.delete('/api/employees/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    console.log(`Received DELETE request for employee with ID: ${employeeId}`);
    
    const query = 'DELETE FROM employees WHERE employeeId = ?';
    
    db.query(query, [employeeId], (err, result) => {
        if (err) {
            console.error(`Error deleting employee with ID ${employeeId}:`, err.message);
            return res.status(500).json({ error: 'Database deletion error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });
    });
});


// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
