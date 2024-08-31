const crypto = require('crypto');

// generar la firma
const generateSignature = (req, res) => {
  try {
   
    const { reference, amountInCents, currency, expirationTime } = req.body;
    
    if (!reference || !amountInCents || !currency) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }
   
    const integritySecret = 'test_integrity_yTA2Vi3uSITPgs9nPd41cq1fIMnO7Uaw';
  
    let baseString = `${reference}${amountInCents}${currency}${integritySecret}`;

    if (expirationTime) {
      baseString = `${reference}${amountInCents}${currency}${expirationTime}${integritySecret}`;
    }

    // Crear el hash usando SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(baseString, 'utf8');
    const hashHex = hash.digest('hex');  
  
    res.json({ signature: hashHex });
  } catch (error) {
  
    console.error('Error al generar la firma:', error);

    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  generateSignature,
};
