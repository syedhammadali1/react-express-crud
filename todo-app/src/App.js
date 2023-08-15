import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  

  const baseUrl = `http://localhost:5000`;
 const fetchData = async () => {
  await fetch(`${baseUrl}/api/todos`)
  .then(response => response.json())
  // .then(data => console.log(data));
  .then(data => setTodos(data));
 }

  useEffect(() => {
    fetchData();
  }, []);


  const handleDelete = (id) => {
    fetch(`${baseUrl}/api/todos/${id}`, {
      method: 'DELETE'
    })
    .then(response => response)
    .then(data => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  const handleEdit = (id, title) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const handleUpdate = (id) => {
    fetch(`${baseUrl}/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: newTitle })
    })
    .then(response => response.json())
    .then(data => {
      setTodos(todos.map(todo => todo.id === id ? data : todo));
      setEditingId('');
      setNewTitle('');
    });
  };


  const handleSave = () => {
    const newTodo = {
      title: newTitle
    };
  
    fetch(`${baseUrl}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTodo)
    })
      .then(response => response.json())
      .then(data => {
        setTodos([...todos, data]);
        setNewTitle('');
      });
  };
  



  return (
    <div>
      <h1>Todo List</h1>

      <input
        type="text"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={handleSave}>Save</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  
                />
                <button onClick={() => handleUpdate(todo.id)}>Save</button>
              </div>
            ) : (
              <div>
                {todo.title}
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
                <button onClick={() => handleEdit(todo.id, todo.title)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
