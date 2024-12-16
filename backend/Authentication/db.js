require("dotenv").config();
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_DB_AUTH_URL;
// console.log(mongoUri);

const connectToMongo_OTP = async () => {
    await mongoose.connect(mongoUri);
    console.log("Authentication Database Connected Successfully");
}

module.exports = connectToMongo_OTP;