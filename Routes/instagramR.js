// instagramRoutes.js
const express = require('express');
const router = express.Router();
const { startAuth, handleCallback, getUserMedia, updateInstagram } = require('../Controllers/instagramC');

// Rutas
router.get('/auth', startAuth);
router.get('/callback', handleCallback);
router.get('/media', getUserMedia);
router.put('/instagram/:userId', updateInstagram);

module.exports = router;
