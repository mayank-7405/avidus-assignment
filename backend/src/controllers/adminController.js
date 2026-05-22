const User = require('../models/User');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// 1. View all users (Admin can see everyone)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Password chhod kar sab bhejo
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Update user status (Active/Inactive)
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.status = req.body.status || user.status;
            const updatedUser = await user.save();
            res.json({ message: 'User status updated', status: updatedUser.status });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. View all tasks (Admin can see tasks created by ANY user)
const getAllTasks = async (req, res) => {
    try {
        // .populate() se hume task banne wale user ka naam aur email bhi mil jayega
        const tasks = await Task.find({}).populate('user', 'name email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. View Activity Logs (Frontend ke admin dashboard ke liye zaroori hai)
const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, deleteUser, updateUserStatus, getAllTasks, getActivityLogs };