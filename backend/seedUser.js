require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.findOneAndUpdate(
            { email: 'admin@avidus.com' }, 
            {
                name: 'Admin User',
                email: 'admin@avidus.com',
                password: hashedPassword,
                role: 'Admin', // 👈 Role change kar diya
                status: 'Active'
            },
            { upsert: true, new: true } 
        );

        console.log('✅ Admin User account ban gaya hai!');
        console.log('👉 Email: admin@avidus.com');
        console.log('👉 Password: admin123');
        process.exit();
    } catch (error) {
        console.log('Error:', error);
        process.exit(1);
    }
};

seedAdminUser();