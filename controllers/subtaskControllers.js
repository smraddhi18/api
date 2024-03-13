// subTaskControllers.js
const SubTask = require('../models/subTaskModel');

const createSubTask = async (req, res) => {
    try {
        const { task_id,status } = req.body;
        if (!task_id) {
            return res.status(400).json({ error: 'Task ID is required' });
        }
        if(status <0 || status>1){
            return res.status(400).json({ error: 'status is wrong' });
        }
        
        const subtask = new SubTask({ taskId:task_id ,status });
        await subtask.save();
        res.status(201).json({ message: 'Subtask created successfully', subtask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getSubTasks = async (req, res) => {
    try {
        const { task_id } = req.query;
        if (!task_id) {
            return res.status(400).json({message:"Provide taskid"});
        }
        const subtasks = await SubTask.find({ taskId:task_id });
        res.json({ subtasks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateSubTask = async (req, res) => {
    try {
        const { subtaskId } = req.params;
        const { status } = req.body;
        if (status !== "0" && status!=="1") {
            return res.status(400).json({ error: 'Status is required. Can be 0 or 1' });
        }
       
        const subtask = await SubTask.findOneAndUpdate({_id:subtaskId}, { status }, { updated_at: Date.now() },{ new: true });
        res.json({ message: 'Subtask updated successfully', subtask:subtask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteSubTask = async (req, res) => {
    try {
        const { subtaskId } = req.params;
       
        await SubTask.findOneAndUpdate({_id:subtaskId}, { deleted_at: Date.now() });
        res.json({ message: 'Subtask deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createSubTask,
    getSubTasks,
    updateSubTask,
    deleteSubTask
};
