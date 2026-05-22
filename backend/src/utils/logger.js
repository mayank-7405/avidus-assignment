const ActivityLog = require('../models/ActivityLog');

// Ek common function jo har jagah se log save karega
const createLog = async (userId, action, details = '') => {
    try {
        await ActivityLog.create({
            user: userId,
            action: action,
            details: details
        });
        console.log(`Log Recorded: ${action} by User ${userId}`);
    } catch (error) {
        console.error(`Failed to create activity log: ${error.message}`);
    }
};

module.exports = createLog;