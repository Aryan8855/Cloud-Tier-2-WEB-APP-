// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const {
    getTasks,
    addTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// GET all tasks
router.get('/', getTasks);

// POST new task
router.post('/', addTask);

// PUT update task
router.put('/:id', updateTask);

// DELETE task
router.delete('/:id', deleteTask);

module.exports = router;