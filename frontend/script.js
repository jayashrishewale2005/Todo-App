const API_URL = "http://localhost:5000/todos";
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

// 1. Fetch all tasks from MongoDB
async function fetchTodos() {
    try {
        const res = await fetch(API_URL);
        const todos = await res.json();
        todoList.innerHTML = '';
        todos.forEach(todo => renderTodo(todo));
    } catch (err) {
        console.error("Failed to fetch:", err);
    }
}

// 2. Add Task (Fixes 'undefined' by refreshing after post)
addBtn.onclick = async () => {
    const text = todoInput.value.trim();
    if (!text) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }) // Key must match Backend schema
    });
    
    todoInput.value = '';
    fetchTodos(); // Refresh list to show real data from DB
};

// 3. Render HTML for each Todo
function renderTodo(todo) {
    const li = document.createElement('li');

    li.innerHTML = `
        <input 
            type="checkbox" 
            ${todo.completed ? 'checked' : ''}
            onchange="toggleComplete('${todo._id}', ${todo.completed})"
        />

        <span 
            class="todo-text ${todo.completed ? 'completed' : ''}"
            onclick="toggleComplete('${todo._id}', ${todo.completed})">
            ${todo.title}
        </span>

        <div class="actions">
            <button class="edit-btn" onclick="editTodo('${todo._id}')">Edit</button>
            <button class="delete-btn" onclick="deleteTodo('${todo._id}')">Delete</button>
        </div>
    `;

    todoList.appendChild(li);
}

// 4. Toggle "Mark as Complete"
async function toggleComplete(id, currentStatus) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
    });
    fetchTodos();
}

// 5. Delete Task
async function deleteTodo(id) {
    if (confirm("Delete this task?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchTodos();
    }
}

// 6. Edit Task
async function editTodo(id) {
    const newText = prompt("Update your task:");
    if (!newText) return;

    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newText })
    });
    fetchTodos();
}

// Load tasks when page opens
fetchTodos();