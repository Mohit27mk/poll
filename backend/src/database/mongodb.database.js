const mongoose = require("mongoose");
const databaseConfig = require("../config/database.config");

const db = `mongodb+srv://${databaseConfig.database_user}:${databaseConfig.database_password}@cluster0.wzw3ecy.mongodb.net/${databaseConfig.database_name}?retryWrites=true&w=majority`;


const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("✅ Database connected successfully");
    } catch (err) {
        console.error("❌ Database connection failed", err);
        process.exit(1);
    }
};

module.exports = connectDB;
