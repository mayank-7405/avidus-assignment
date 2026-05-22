const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

// Har route ke aage 'protect' laga hai, matlab bina login koi inko use nahi kar payega
router.route('/')
    .post(protect, createTask)   // Task banane ka raasta
    .get(protect, getTasks);     // Tasks dekhne ka raasta

router.route('/:id')
    .put(protect, updateTask)    // Task update karne ka raasta
    .delete(protect, deleteTask); // Task delete karne ka raasta

module.exports = router;