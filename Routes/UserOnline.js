const router = require('express').Router();
const { 
    addUser,
    addId,
    getUserById,
    deleteUserById
 } = require('../Controllers/OnlineUser'); 


// Define la ruta para agregar un nuevo id
router.post('/addId/:id', addId); 

// Ruta para obtener todos los usuarios
router.get('/GetUserOnline/:id', getUserById);

// Ruta para eliminar un usuario por su ID
router.delete('/DeleteUserOnline/:userId', deleteUserById);

module.exports = router;
