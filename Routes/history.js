
const express = require('express');
const router = express.Router();
const { 
    createAttendance, 
    updateAttendanceByUserId, 
    getAttendancesByUserId  
} = require('../Controllers/History'); // Ajusta la ruta según sea necesario

// Ruta para crear una nueva entrada de asistencia
// Crea una entrada de asistencia para cada usuario
router.post('/attendances', createAttendance);

// Ruta para actualizar el estado de asistencia por userId
router.put('/attendances/:userId', updateAttendanceByUserId);

// Ruta para obtener todas las asistencias por userId
router.get('/attendances/:userId', getAttendancesByUserId);

module.exports = router;
