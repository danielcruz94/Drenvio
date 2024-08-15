const express = require('express');
const router = express.Router();
const { startAuth, handleCallback, getUserMedia, updateInstagram, downloadImages } = require('../Controllers/instagramC');

// Rutas
router.get('/auth', startAuth);
router.get('/callback', handleCallback);
router.get('/media', getUserMedia);
router.put('/instagram/:userId', updateInstagram);
// Nueva ruta para descargar imágenes
router.post('/download-images', downloadImages);

module.exports = router;
