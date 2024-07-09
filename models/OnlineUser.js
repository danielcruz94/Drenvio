const { Schema, model } = require('mongoose');

// Definición del esquema
const UserSchema = new Schema({
    userId: { type: String, required: true, unique: true }
});

// Creación del modelo
const UserOnline = model('UserOnline', UserSchema);

module.exports = UserOnline;
