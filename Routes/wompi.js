const router = require('express').Router();
const { 
    generateSignature,
    handleWompiEvent,
    getByReference
 } = require('../Controllers/wompi');


// Ruta para generar la firma de integridad
router.post('/generate-signature', generateSignature);

// Ruta para manejar eventos de Wompi
router.post('/webhook', handleWompiEvent);

// Ruta para optener datos de Wompi
router.get('/wompi/:reference', getByReference);

module.exports = router;
