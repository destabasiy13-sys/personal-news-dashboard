const nodemailer = require('nodemailer');

let transporter;

// Ethereal is a fake SMTP service for testing - it never delivers real email.
// createTestAccount() generates a temporary inbox we can view in a browser,
// so no real email credentials are needed for this project to work.
async function initMailer() {
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    // Some hosts (e.g. Render's free tier) restrict outbound SMTP; without a
    // timeout a blocked connection hangs the request indefinitely instead of
    // failing fast.
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });

  console.log('Ethereal test inbox ready:', testAccount.user);
}

async function sendVerificationEmail(toEmail, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const info = await transporter.sendMail({
    from: '"Personal News Dashboard" <no-reply@newsdashboard.test>',
    to: toEmail,
    subject: 'Verify your email address',
    html: `<p>Click the link below to verify your email address:</p>
           <p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  console.log('Verification email preview URL:', nodemailer.getTestMessageUrl(info));
}

module.exports = { initMailer, sendVerificationEmail };
