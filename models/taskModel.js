// taskModel.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    due_date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Define a virtual property to derive the priority based on the due date
taskSchema.virtual('priority').get(function() {
    const today = new Date();
    const dueDate = new Date(this.due_date);
    const differenceInDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
        return 0; // Due date is today
    } else if (differenceInDays >= 1 && differenceInDays <= 2) {
        return 1; // Due date is between tomorrow and day after tomorrow
    } else if (differenceInDays >= 3 && differenceInDays <= 4) {
        return 2; // Due date is 3-4 days from today
    } else {
        return 3; // Due date is 5+ days from today
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
