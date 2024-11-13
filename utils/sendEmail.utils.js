const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    
    const transporter = nodeMailer.createTransport({
        service: "gmail", 
        auth: {
            user:"thaparoman970@gmail.com",
            pass:process.env.SMPT_PASSWORD
        }
    })
    const mailOptions = {
        from: "thaparoman970@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;