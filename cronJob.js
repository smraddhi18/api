// // cronJobs.js

const cron = require('node-cron');
const Task = require('./models/taskModel');
const User = require('./models/userModel');
const twilio = require('twilio');
require('dotenv').config()

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// Function to change task priorities based on due date
const changeTaskPriority = async () => {
    try {
        const today = new Date();
        const tasksToUpdate = await Task.find({ due_date: today });
        
        for (const task of tasksToUpdate) {
            const priority = calculatePriority(task.due_date);
            task.priority = priority;
            await task.save();
        }
        console.log('Task priorities updated successfully.');
    } catch (err) {
        console.error('Error in changing task priority:', err);
    }
};

const calculatePriority = (dueDate) => {
    const currentDate = new Date();
    const differenceInDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
    
    if (differenceInDays === 0) {
        return 0;
    } else if (differenceInDays <= 2) {
        return 1;
    } else if (differenceInDays <= 4) {
        return 2;
    } else {
        return 3;
    }
};

const call=async () => {
    try {
        // Find all tasks where due_date has passed
        const tasks = await Task.find({ due_date: { $lt: new Date() } }).sort({ due_date: 1 });

        // Loop through overdue tasks and try calling each user
        let i=0
        for (const task of tasks) {
            const user = await User.findOne({ _id: task.user_id }).sort({ priority: i });

            // Assuming user has a field 'phone_number'
            const phoneNumber = user.phone_number;

            // Make a call using Twilio
            const call = await client.calls.create({
                twiml: `<Response><Say>Your task "${task.name}" is overdue. Please attend to it immediately.</Say></Response>`,
                to: phoneNumber,
                from: 'your_twilio_phone_number'
            });

            // If call status is 'completed', move to the next task
            if (call.status !== 'completed' && i<=2 ) {
                i++;
            } 
            else if(call.status === 'complete'){
                break;
            }
        }
    } catch (error) {
        console.error('Error making voice call:', error);
    }
}

// Schedule cron jobs
const scheduleCronJobs = async () => {
    cron.schedule('0 0 * * *', changeTaskPriority); // Run every day at midnight
    // Schedule the voice calling cron job to run every day at 9 AM
    cron.schedule('0 9 * * *', call);
    
};

module.exports = { scheduleCronJobs };

