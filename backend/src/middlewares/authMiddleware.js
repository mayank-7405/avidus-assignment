const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GUARD 1: Check karna ki user properly logged-in hai (Token valid hai)
const protect = async (req, res, next) => {
    let token;

    // Header mein check karte hain ki 'Bearer' token aaya hai ya nahi
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Token extract karna
            token = req.headers.authorization.split(' ')[1];

            // Token ko decode karke verify karna ki asli hai ya nakli
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Database se user dhundh kar request (req) mein save kar dena
            // .select('-password') ka matlab hai password ko chhod kar baaki details lao
            req.user = await User.findById(decoded.id).select('-password');

            // Ek extra check: Agar Admin ne user ko block (Inactive) kar diya hai
            if (req.user.status === 'Inactive') {
                return res.status(403).json({ message: 'Your account is currently inactive.' });
            }

            next(); // Sab theek hai, aage badhne do
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// GUARD 2: Check karna ki user sach mein 'Admin' hai
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next(); // Admin hai toh aage badhne do
    } else {
        res.status(403).json({ message: 'Access denied! Not authorized as an Admin' });
    }
};

module.exports = { protect, admin };