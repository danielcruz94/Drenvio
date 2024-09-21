const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  picture: { type: String, default: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg' },
  photos: { type: [String] }, // Se ha añadido el tipo de datos a los arrays
  role: { type: String },
  joinedAt: { type: Date, default: Date.now },
  language: { type: String, default: "" },
  goal: { type: String },
  teacherRates: { type: [String] }, // Se ha añadido el tipo de datos a los arrays
  appointments: { type: [Date] }, // Se ha añadido el tipo de datos a los arrays
  history: { type: [String] }, // Se ha añadido el tipo de datos a los arrays
  instagram: { type: String },
  country: { type: String },
  connectedHours: { type: Number, default: 0 },
  price: { type: String, default: "0"},
  points: { type: Number, default: 500 },
  completeInfo: { type: Boolean, default: false },
  biography: { type: String, default: '¡Hola! Soy un apasionado/a de la conversación, los idiomas y los viajes...' },
  bank_account: { type: String }, 
  bank: { type: String },
  tutorial: { type: Boolean, default: false }
});

// Configuración de `toJSON` para ocultar campos sensibles
UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const User = model('User', UserSchema);

module.exports = User;
