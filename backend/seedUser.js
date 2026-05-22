require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedNormalUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('user123', salt);

        await User.findOneAndUpdate(
            { email: 'user@avidus.com' }, 
            {
                name: 'Normal User',
                email: 'user@avidus.com',
                password: hashedPassword,
                role: 'User',
                status: 'Active'
            },
            { upsert: true, new: true } 
        );

        console.log('✅ Normal User account ban gaya hai!');
        console.log('👉 Email: user@avidus.com');
        console.log('👉 Password: user123');
        process.exit();
    } catch (error) {
        console.log('Error:', error);
        process.exit(1);
    }
};

seedNormalUser();