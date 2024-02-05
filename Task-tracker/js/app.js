// Created an array/object containing tasks with properties like title, description, due date, etc.
class Task {
    constructor(title, description, dueDate, priority, status = 'pending') {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
    }
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//Used browser APIs (e.g., localStorage for saving user preferences).
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
//Designed a user interface to display tasks and their details.

function renderTasks(filteredTasks = tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = task.status === 'completed' ? 'task completed' : 'task';
        taskElement.innerHTML = `
            <h3>${task.title} [${task.priority}] ${task.status === 'completed' ? '(Completed)' : ''}</h3>
            <p>${task.description}</p>
            <p>Due: ${task.dueDate}</p>
            <button onclick="toggleTaskCompletion(${task.id})">${task.status === 'completed' ? 'Undo' : 'Complete'}</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="editTaskPrompt(${task.id})">Edit</button>
        `;
        taskList.appendChild(taskElement);
    });
}

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;
    const priority = document.getElementById('priority').value;

    if (!title.trim() || !description.trim() || !dueDate.trim()) {
        customAlert("Please fill out all fields."); // Implemented error handling for scenarios such as adding a task with missing details.
        return;
    }

    addTask(title, description, dueDate, priority);
    this.reset(); 
});
//Implemented functionalities to add, edit, and delete tasks dynamically.
function addTask(title, description, dueDate, priority) {
    const newTask = new Task(title, description, dueDate, priority);
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

function toggleTaskCompletion(taskId) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = tasks[taskIndex].status === 'pending' ? 'completed' : 'pending';
        saveTasks();
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id != taskId);
    saveTasks();
    renderTasks();
}

function editTaskPrompt(taskId) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex === -1) return;
    const task = tasks[taskIndex];

    const newTitle = prompt('Edit task title', task.title);
    const newDescription = prompt('Edit task description', task.description);
    const newDueDate = prompt('Edit task due date', task.dueDate);
    const newPriority = prompt('Edit task priority', task.priority);

    if (newTitle && newDescription && newDueDate && newPriority) {
        editTask(taskId, newTitle, newDescription, newDueDate, newPriority);
    }
}

function editTask(taskId, title, description, dueDate, priority) {
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].dueDate = dueDate;
        tasks[taskIndex].priority = priority;
        saveTasks();
        renderTasks();
    }
}

function customAlert(message) {
    alert(message); 
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    renderTasks();
});
//Added option to sort tasks based on different conditions and apply filters.
function sortTasks(sortBy) {
    if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sortBy === 'priority') {
        const priorityOrder = {High: 1, Medium: 2, Low: 3};
        tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'title') {
        tasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    renderTasks();
}

document.getElementById('sortSelect').addEventListener('change', function() {
    sortTasks(this.value);
});

function filterTasks(filterBy, value) {
    let filteredTasks = tasks;
    if (filterBy === 'status' && value !== 'all') {
        filteredTasks = tasks.filter(task => task.status === value);
    } else if (filterBy === 'priority' && value !== 'all') {
        filteredTasks = tasks.filter(task => task.priority === value);
    }
    renderTasks(filteredTasks);
}

document.getElementById('filterStatus').addEventListener('change', function() {
    filterTasks('status', this.value);
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
    renderTasks();
});
