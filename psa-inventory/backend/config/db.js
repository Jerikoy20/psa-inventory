const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This connects to your local MongoDB database named 'psa_inventory'
    // If you haven't created the database yet, MongoDB will create it automatically.
    const conn = await mongoose.connect('mongodb://localhost:27017/psa_inventory');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1); // Stop server if connection fails
  }
};

module.exports = connectDB;