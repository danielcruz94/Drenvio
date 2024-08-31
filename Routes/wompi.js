const router = require('express').Router();
const {generateSignature} = require('../Controllers/wompi');

// Ruta para generar la firma de integridad
router.post('/generate-signature', generateSignature);

module.exports = router;
