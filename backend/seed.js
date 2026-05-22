require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const seedAdmin = async () => {
    try {
        // Database se connect karna
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected...');

        // Password ko encrypt karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Database mein Admin insert karna
        await User.findOneAndUpdate(
            { email: 'admin@avidus.com' }, // Check karega ki is email se koi hai ya nahi
            {
                name: 'Avidus Admin',
                email: 'admin@avidus.com',
                password: hashedPassword,
                role: 'Admin',
                status: 'Active'
            },
            { upsert: true, new: true } // Agar nahi hai toh naya bana dega
        );

        console.log('✅ Admin account ban gaya hai! 🎉');
        console.log('👉 Email: admin@avidus.com');
        console.log('👉 Password: admin123');
        process.exit();
    } catch (error) {
        console.log('Error:', error);
        process.exit(1);
    }
};

seedAdmin();