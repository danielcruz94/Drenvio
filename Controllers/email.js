const nodemailer = require('nodemailer');

const enviarEmail = async (req, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: 'teamtoriiapp@gmail.com',
            pass: 'dgybcegilwsjwihm' // Este valor debería provenir de tu entorno seguro
        },
        // NOTA: Desactivar la verificación del certificado temporalmente para pruebas,
        // pero asegúrate de obtener y usar un certificado SSL/TLS válido para producción.
        tls: {
            rejectUnauthorized: false // Desactiva la verificación del certificado
        }
    });

    


    const { to, subject, text } = req.body;

    console.log(to);

    let info = await transporter.sendMail({
        from: 'teamtoriiapp@gmail.com',
        to: to,
        subject: subject,
        html: text  
    });

    res.send('Email enviado exitosamente');
}

module.exports = enviarEmail;
