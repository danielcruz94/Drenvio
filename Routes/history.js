const express = require('express');
const router = express.Router();
const { 
    createAttendance, 
    updateAttendanceByUserId, 
    getAttendancesByUserId,
    getAttendanceCountByUserId  
} = require('../Controllers/History'); 

// Rutas
router.post('/attendances', createAttendance);
router.put('/attendances/:eventId/:userId', updateAttendanceByUserId);
router.get('/attendances/:userId', getAttendancesByUserId);
router.get('/attendances/count/:userId', getAttendanceCountByUserId);

module.exports = router;
