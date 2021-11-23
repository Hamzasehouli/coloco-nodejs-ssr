const nodemailer = require('nodemailer');
const sendEmail = function (mailOptions) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '33cbbfabacc4d6',
      pass: 'fee0765f92eeb2',
    },
  });

  const Options = {
    from: mailOptions.from, // sender address
    to: mailOptions.to, // list of receivers
    subject: mailOptions.subject, // Subject line
    text: mailOptions.text, // plain text body
    // html: '<b>Hello world?</b>', // html body
  };

  transporter.sendMail(Options);
};

module.exports = sendEmail;
