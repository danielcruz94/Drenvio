const { Schema, model } = require('mongoose');

// Definición del esquema para el modelo Wompi
const WompiSchema = new Schema({
    id: { type: String, required: true },  
    reference: { type: String, required: true },  
    finalized_at: { type: Date, required: true },  
    status: { type: String, required: true }  
});

// Creación del modelo basado en el esquema
const Wompi = model('Wompi', WompiSchema);

module.exports = Wompi;
