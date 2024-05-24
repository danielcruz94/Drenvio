const nodemailer = require('nodemailer');

const enviarEmail = async (req, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu', port: 465, // Cambiado para TLS
        secure: true, // Cambiado a true para TLS
        auth: {
            user: 'info@thaskify.com',
            pass: 'Proyecto001!'//enviar en .env
        }
    });

    const {to,subject,text}=req.body

    console.log(to)

    let info = await transporter.sendMail({
      from: 'info@torii.com',
      to, // Cambiado para usar "to"
      subject, // Cambiado para usar "subject"
      text, // Cambiado para usar "body" como el texto del email
    });

    res.send('Email enviado exitosamente');
}

module.exports= enviarEmail;