const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Ye batayega ki ye task kis user ka hai
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);