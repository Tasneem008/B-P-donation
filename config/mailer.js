const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // e.g. sandbox.smtp.mailtrap.io
  // port: Number(process.env.SMTP_PORT),// e.g. 2525
  port: 2525, // e.g. 2525
  auth: {
    user: "25690a14ae56f4",
    pass: "69020ef17ee6a2",
  },
});

module.exports = transporter;
