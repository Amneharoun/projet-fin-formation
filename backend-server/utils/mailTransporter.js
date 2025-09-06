require("dotenv").config();
const nodemailer = require("nodemailer");
const trnasporter = nodemailer.createTransport({
    service: "Gmail",
    auth:{
       user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = trnasporter;