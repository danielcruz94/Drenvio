const express = require('express');
const router = express.Router();
const {
    createAttendance,
    updateAttendanceByUserId,
    getAttendancesByUserId,
    getAttendanceCountByUserId
} = require('../Controllers/History'); // Ajusta la ruta según la estructura de tu proyecto

// Ruta para crear nuevas asistencias
router.post('/attendances', createAttendance);

// Ruta para actualizar el estado de asistencia de un usuario específico
router.put('/attendances/:eventId/:userId', updateAttendanceByUserId);

// Ruta para obtener todas las asistencias de un usuario
router.get('/attendances/:userId', getAttendancesByUserId);

// Ruta para contar asistencias por userId
router.get('/attendance/count/:userId', getAttendanceCountByUserId);

module.exports = router;
