const crypto = require('crypto');
const mongoose = require('mongoose');
const Wompi = require('../models/wompi'); 


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

    // Función para extraer valores de un objeto usando una ruta de propiedad
    const getValueFromObject = (obj, prop) => {
      return prop.split('.').reduce((o, p) => o ? o[p] : '', obj) || '';
    };

    // Manejo del evento
    const handleWompiEvent = async (req, res) => {
      try {
        const event = req.body;
        const receivedChecksum = req.headers['x-event-checksum'];
        const secret = 'test_events_fQakA3SvZ8UNrImwQVLjmVia0TeR2HiZ'; 

        let concatenatedString = '';
        event.signature.properties.forEach(prop => {
          const value = getValueFromObject(event.data, prop);
          concatenatedString += value;
        });

        concatenatedString += event.timestamp;    
        concatenatedString += secret;
      
        const checksum = crypto.createHash('sha256').update(concatenatedString, 'utf8').digest('hex'); 
      
        if (checksum === receivedChecksum) {      
      
          const { id, reference, finalized_at, status } = event.data.transaction;
        
          const wompiData = new Wompi({
            id,
            reference,
            finalized_at,
            status
          });
          
          try {
            await wompiData.save();
            console.log('Datos guardados en la base de datos');
          } catch (err) {
            console.error('Error al guardar los datos en la base de datos:', err);
          }

        } else {
          console.log('Checksum inválido');
        }

        // Responder con el estado HTTP 200 en ambos casos
        res.status(200).send('Evento recibido');
      } catch (error) {
        console.error('Error al manejar el evento:', error);
        res.status(500).send('Error al procesar el evento');
      }
    };

// Controlador para obtener documentos por reference
const getByReference = async (req, res) => {
  try {
      const { reference } = req.params;

      if (!reference) {
          return res.status(400).json({ error: 'El parámetro reference es requerido' });
      }

      // Buscar todos los documentos que coincidan con el reference dado
      const documents = await Wompi.find({ reference });

      if (documents.length === 0) {
          return res.status(404).json({ message: 'No se encontraron documentos con ese reference' });
      }

      return res.status(200).json(documents);
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  generateSignature,
  handleWompiEvent,
  getByReference
};
