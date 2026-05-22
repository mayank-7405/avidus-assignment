const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateUserStatus, getAllTasks, getActivityLogs } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Har raste ke aage dono guards lagaye hain: login hai? + kya role Admin hai?
router.route('/users')
    .get(protect, admin, getAllUsers);

router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .patch(protect, admin, updateUserStatus); 

router.route('/tasks')
    .get(protect, admin, getAllTasks);

router.route('/logs')
    .get(protect, admin, getActivityLogs);

module.exports = router;