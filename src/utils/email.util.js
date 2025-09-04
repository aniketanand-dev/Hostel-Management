const nodemailer = require('nodemailer');

exports.sendEmail = async (email, subject, message) => {
    try {
        // 1. Create a transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', // or any other email service
            auth: {
                user: 'aniket72094087100@gmail.com',
                pass: 'afkw xzau pzke qhmo'
            }
        });

        // 2. Setup email options
        let mailOptions = {
            from: '"Hostel Management System" <aniket72094087100@gmail.com>',
            to: email,
            subject: subject,
            text: message,
        };

        // 3. Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
