require("dotenv").config();
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_DB_USER_URL;
// console.log(mongoUri);

const connectToMongo_User = async () => {
    await mongoose.connect(mongoUri);
    console.log("User Database Connected Successfully");
}

module.exports = connectToMongo_User;