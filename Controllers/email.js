

const nodemailer = require('nodemailer');

const enviarEmail = async (req, res) => {
  // Use the correct email address and password for teamtoriiapp@gmail.com
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail's SMTP server
    auth: {
      user: 'teamtoriiapp@gmail.com', // Replace with actual sender email
      pass: 'dgybcegilwsjwihm', // Replace with actual app password (not regular password)
    },
  });

  const { to, subject, text } = req.body;



  try {
    // Send the email using the transporter
    await transporter.sendMail({
      from: 'teamtoriiapp@gmail.com', // Replace with actual sender email
      to: to,
      subject: subject,
      html: text,
    });

    res.send('Email enviado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar el correo electrónico');
  }
};

module.exports = enviarEmail;
