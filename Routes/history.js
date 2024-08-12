const express = require('express');
const router = express.Router();
const { 
    createAttendance, 
    updateAttendanceByUserId, 
    getAttendancesByUserId,
    getAttendanceCountByUserId,
    updatePaidStatus  
} = require('../Controllers/History'); 

// Rutas
router.post('/attendances', createAttendance);
router.put('/attendances/:eventId/:userId', updateAttendanceByUserId);
router.get('/attendances/:userId', getAttendancesByUserId);
router.get('/attendances/count/:userId', getAttendanceCountByUserId);
router.put('/attendances/pay/:userId/:count', updatePaidStatus);

module.exports = router;
