const mongoose = require("mongoose");

const schema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        require: true
    },
    otp: {
        type: Number,
        require: true
    },
    otpToken: {
        type: String,
        require: true
    },
    purpose: {
        type: String,
        enum: ["verify-email", "reset-password"],
        require: true
    }
},
    { timestamps: true }
);

const otpModel = mongoose.model("otps", schema);

module.exports = otpModel;
