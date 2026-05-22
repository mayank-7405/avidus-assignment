const createLog = require('../utils/logger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Token banane ka function (Identity card ki tarah)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. Naya User Register Karne Ka Logic
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check karo ki email pehle se exist toh nahi karti
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Password ko encrypt (hash) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user create karna
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'User' // Agar role nahi diya, toh default 'User' banega
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id) // Token bhej rahe hain taaki direct login ho jaye
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// 2. User Login Karne Ka Logic
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Database mein check karo ki is email se koi user hai kya
        const user = await User.findOne({ email });
        // Agar user mil gaya aur password match ho gaya
        if (user && (await bcrypt.compare(password, user.password))) {
            
            await createLog(user._id, 'Login activity', 'User logged in successfully');
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id) // Login success hone par token de do
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { registerUser, loginUser };