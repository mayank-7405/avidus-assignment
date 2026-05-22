const Task = require('../models/Task');
const createLog = require('../utils/logger');

// 1. Create a New Task (User permission: Create own tasks)
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        const task = await Task.create({
            title,
            description,
            user: req.user.id // Ye req.user humare 'protect' middleware se aayega
        });

        // Assignment Requirement: Track Task creation
        await createLog(req.user.id, 'Task creation', `Created task: ${task.title}`);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Get User's Own Tasks (User permission: View own tasks only)
const getTasks = async (req, res) => {
    try {
        // Sirf wahi task dhoondo jinka user id, logged-in user ki id se match kare
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update a Task (User permission: Update own tasks)
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check karo ki jo user task update kar raha hai, wo iska malik hai ya nahi
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Assignment Requirement: Track Task update
        await createLog(req.user.id, 'Task update', `Updated task: ${updatedTask.title}`);

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Delete a Task (User permission: Delete own tasks)
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check ownership
        if (task.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();

        // Assignment Requirement: Track Task deletion
        await createLog(req.user.id, 'Task deletion', `Deleted task: ${task.title}`);

        res.json({ message: 'Task removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };