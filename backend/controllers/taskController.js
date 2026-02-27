// Get pool from app locals
const getPool = (req) => req.app.locals.db;

// Get all tasks
const getTasks = async (req, res) => {
    try {
        const pool = getPool(req);
        const [rows] = await pool.query(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
};

// Add new task
const addTask = async (req, res) => {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Task title is required'
        });
    }

    try {
        const pool = getPool(req);
        const [result] = await pool.query(
            'INSERT INTO tasks (title) VALUES (?)',
            [title.trim()]
        );
        
        const [newTask] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            data: newTask[0],
            message: 'Task added successfully'
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding task',
            error: error.message
        });
    }
};

// Update task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status, title } = req.body;

    try {
        const pool = getPool(req);
        
        if (title && status) {
            await pool.query(
                'UPDATE tasks SET title = ?, status = ? WHERE id = ?',
                [title, status, id]
            );
        } else if (status) {
            await pool.query(
                'UPDATE tasks SET status = ? WHERE id = ?',
                [status, id]
            );
        } else if (title) {
            await pool.query(
                'UPDATE tasks SET title = ? WHERE id = ?',
                [title, id]
            );
        }

        const [updatedTask] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [id]
        );

        if (updatedTask.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: updatedTask[0],
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: error.message
        });
    }
};

// Delete task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = getPool(req);
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
};

module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask
};