// subTaskModel.js

const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    taskId : {
        type: String,
        ref: 'Task', // Reference to the Task model
        required: true
    },
    status: {
        type: Number,
        required: true,
        enum: [0, 1] // 0 -TODO, 1 - Complete
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

const SubTask = mongoose.model('SubTask', subTaskSchema);

module.exports = SubTask;
