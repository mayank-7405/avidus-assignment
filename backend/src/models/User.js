const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Admin', 'User'], // Assignment ki strict requirement
        default: 'User' 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], // Admin status change kar sakta hai
        default: 'Active' 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);