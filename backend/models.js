const mongoose = require("mongoose");
const otpSchema = require("./Authentication/model/OTP");
const userSchema = require("./User/model/User");

module.exports = {
    getOTPModel: () => mongoose.connection.useDb("OTP").model("Authentication", otpSchema),
    getUserModel: () => mongoose.connection.useDb("User").model("User", userSchema),
};