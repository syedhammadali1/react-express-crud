const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 5000;



app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'todos',
    connectionLimit: 10
});


// Test the database connection
pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database');
    connection.release();
});


// crud without using database

// let todos = [];

// app.get('/api/todos', (req, res) => {
//     console.log('back');
//    return res.json(todos);
// });

// app.post('/api/todos', (req, res) => {
//     const todo = req.body;
//     todo.id = Date.now().toString()
//     todos.push(todo);
//     res.status(201).json(todo);
// });


// app.put('/api/todos/:id', (req, res) => {
//     const { id } = req.params;
//     const updatedTodo = req.body;
//     updatedTodo.id = id;
//     todos = todos.map(todo => todo.id === id ? updatedTodo : todo);
//     res.json(updatedTodo);
// });

// app.delete('/api/todos/:id', (req, res) => {
//     const { id } = req.params;
//     todos = todos.filter(todo => todo.id !== id);
//     res.json({ message: 'Todo deleted successfully' });
// });



// crud with using mysql database 

// Create a new todo
app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    const sql = 'INSERT INTO tasks (title) VALUES (?)';
    pool.query(sql, [title], (err, results) => {
      if (err) {
        console.error('Error creating todo:', err);
        res.status(500).json({ error: 'Error creating todo' });
        return;
      }
      res.status(201).json({ id: results.insertId, title });
    });
  });


  
// Get all todos
app.get('/api/todos', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    pool.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ error: 'Error fetching todos' });
        return;
      }
      res.json(results);
    });
  });


// Update a todo
app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const sql = 'UPDATE tasks SET title = ? WHERE id = ?';
    pool.query(sql, [title, id], (err, results) => {
      if (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Error updating todo' });
        return;
      }
      res.json({ id, title });
    });
});  


// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    pool.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ error: 'Error deleting todo' });
        return;
      }
      res.sendStatus(204);
    });
});