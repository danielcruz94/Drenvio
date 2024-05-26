const router = require('express').Router();
const { createCalendarClass, getAllCalendarClasses, getCalendarClassesByUserId, reserveCalendarClass, getCalendarClassesByUser } = require('../Controllers/CalendarClass');

// Ruta para crear una nueva clase de calendario
router.post('/calendar', createCalendarClass);

// Ruta para obtener todas las clases de calendario
router.get('/calendar', getAllCalendarClasses);

// Ruta para obtener las clases de calendario por userId
router.get('/calendar/:userId', getCalendarClassesByUserId);

// Ruta para reservar una clase de calendario
router.put('/calendar/reserve/:classId', reserveCalendarClass);

router.get('/calendar/classes/:studentId', getCalendarClassesByUser);



module.exports = router;
