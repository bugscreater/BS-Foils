const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 465,
            secure: true, 
            logger:true,
            debug:true,
            secureConnection:false,
            auth: {
                user: "pandeyshubhambhu09@gmail.com",
                pass: process.env.PASS,
            },
            tls:{
                rejectUnauthorized:true
            }
        });
        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;