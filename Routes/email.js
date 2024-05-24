const router = require('express').Router();
const enviarEmail = require('../Controllers/email') 




router.post('/enviar-email',enviarEmail);

module.exports = router;
