// API Base URL
const API_BASE = 'http://localhost:5000/api/tasks';
// State
let currentFilter = 'all';
let tasks = [];

// DOM Elements
const tasksList = document.getElementById('tasksList');
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

// Modal Elements
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
let currentEditId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Form submit
    taskForm.addEventListener('submit', handleAddTask);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    
    // Modal close
    document.querySelector('.close-modal').addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Save edit
    saveEditBtn.addEventListener('click', handleEditSave);
    editTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleEditSave();
        }
    });
}

// Fetch all tasks
async function fetchTasks() {
    try {
        showLoading();
        const response = await fetch(API_BASE);
        const data = await response.json();
        
        if (data.success) {
            tasks = data.data;
            updateStats();
            renderTasks();
        } else {
            showError('Failed to fetch tasks');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Network error. Please try again.');
    }
}

// Add new task
async function handleAddTask(e) {
    e.preventDefault();
    
    const title = taskInput.value.trim();
    if (!title) return;
    
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });
        
        const data = await response.json();
        
        if (data.success) {
            tasks.unshift(data.data);
            taskInput.value = '';
            updateStats();
            renderTasks();
            showSuccess('Task added successfully!');
        } else {
            showError(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to add task');
    }
}

// Toggle task status
async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const index = tasks.findIndex(t => t.id === id);
            tasks[index] = data.data;
            updateStats();
            renderTasks();
            showSuccess(`Task marked as ${newStatus}!`);
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to update task');
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            tasks = tasks.filter(t => t.id !== id);
            updateStats();
            renderTasks();
            showSuccess('Task deleted successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to delete task');
    }
}

// Open edit modal
function openEditModal(id, currentTitle) {
    currentEditId = id;
    editTaskInput.value = currentTitle;
    editModal.style.display = 'flex';
    editTaskInput.focus();
}

// Close edit modal
function closeEditModal() {
    editModal.style.display = 'none';
    currentEditId = null;
    editTaskInput.value = '';
}

// Handle edit save
async function handleEditSave() {
    const newTitle = editTaskInput.value.trim();
    if (!newTitle || !currentEditId) return;
    
    try {
        const response = await fetch(`${API_BASE}/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const index = tasks.findIndex(t => t.id === currentEditId);
            tasks[index] = data.data;
            renderTasks();
            closeEditModal();
            showSuccess('Task updated successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to update task');
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Render tasks based on filter
function renderTasks() {
    let filteredTasks = tasks;
    
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => t.status === 'pending');
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.status === 'completed');
    }
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No tasks found</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-item" data-id="${task.id}">
            <div class="task-content">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.status === 'completed' ? 'checked' : ''}
                    onchange="toggleTaskStatus(${task.id}, '${task.status}')"
                >
                <span class="task-title ${task.status === 'completed' ? 'completed' : ''}">
                    ${escapeHtml(task.title)}
                </span>
            </div>
            <div class="task-actions">
                <button class="btn-icon edit" onclick="openEditModal(${task.id}, '${escapeHtml(task.title)}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// UI Helpers
function showLoading() {
    tasksList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading tasks...</p>
        </div>
    `;
}

function showError(message) {
    // You can implement a toast notification here
    console.error(message);
    alert(message);
}

function showSuccess(message) {
    // You can implement a toast notification here
    console.log(message);
}

// Make functions global for onclick handlers
window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;