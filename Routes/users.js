const Router = require('express').Router();
const { 
  login, 
  newStudent, 
  getUsers, 
  completeInfo, 
  getUserData, 
  getUserById, 
  upPhoto,
  updateBankDetails,
  getBankDetails,
  getTutorsWithCustomPicture 
} = require('../Controllers/Users');

// Rutas existentes
Router.post('/login', login);
Router.get('/users', getUsers);
Router.post('/signup', newStudent);
Router.post('/userinformation', completeInfo);
Router.get('/userdata', getUserData);
Router.get('/user/:id', getUserById);
Router.post('/user/update/photo', upPhoto);
Router.get('/users/picture', getTutorsWithCustomPicture);

// Ruta para actualizar detalles bancarios
Router.put('/user/:id/bank-details', updateBankDetails);
Router.get('/user/:id/bank-details', getBankDetails);

module.exports = Router;
