const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_DB_AUTH_URL;
console.log(mongoUri);

const connectToMongo = async () => {
    await mongoose.connect(mongoUri);
    console.log("Database Connected Successfully");
}

module.exports = connectToMongo;