// taskControllers.js

const Task = require('../models/taskModel');
const SubTask = require('../models/subTaskModel');

const createTask = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        const createdBy = req.user.userId; // Assuming userId is in JWT payload
        if (!title || !description || !due_date) {
            return res.status(400).json({ error: 'Title, description, and due date are required' });
        }
        const task = new Task({ title, description, due_date, user_id: createdBy });
        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTasks = async (req, res) => {
    try {
        // Handle query parameters for filtering and pagination
        const { priority, due_date, page = 1, limit = 10 } = req.query;
        const query = { user_id: req.user.userId };
        console.log(query);
        if (priority) query.priority = priority;
        if (due_date) query.due_date = due_date;
        const tasks = await Task.find(query)
                                .skip((page - 1) * limit)
                                .limit(limit);
        res.json({ tasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { due_date, status } = req.body;
        const updatedFields = {};
        if (due_date) updatedFields.due_date = due_date;
        if (status) updatedFields.status = String(status);
        if(status==="1"){ return res.json({message:"it can be 0 or 2"})}
        const task = await Task.findOneAndUpdate({_id:taskId}, updatedFields, { new: true });
        
        // Update corresponding subtasks if status is updated
        if (status !== undefined) {
            await SubTask.updateMany({ task_id: taskId }, { status });
        }

        res.json({ message: 'Task updated successfully', task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        await Task.findOneAndUpdate({_id:taskId}, { deleted_at: Date.now() });
        
        // Soft delete corresponding subtasks
        await SubTask.updateMany({ task_id: taskId }, { deleted_at: Date.now() });

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
