const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text,filename,buffer) => {
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
                user: "enter your email here...",
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
            attachments: filename && buffer && [
                {
                  filename,
                  content: buffer,
                  contentType:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                },
            ],
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;