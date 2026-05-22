const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    action: { 
        type: String, 
        enum: ['Login activity', 'Task creation', 'Task update', 'Task deletion'], 
        required: true 
    },
    details: { type: String } // Optional detail jaise "Task id 123 deleted"
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);