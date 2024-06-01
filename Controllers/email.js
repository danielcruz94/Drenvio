const nodemailer = require('nodemailer');

const enviarEmail = async (req, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.eu',
        port: 465,
        secure: true,
        auth: {
            user: 'info@thaskify.com',
            pass: 'Proyecto001!' // Este valor debería provenir de tu entorno seguro
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
        from: 'info@thaskify.com',
        to: to,
        subject: subject,
        text: text
    });

    res.send('Email enviado exitosamente');
}

module.exports = enviarEmail;
