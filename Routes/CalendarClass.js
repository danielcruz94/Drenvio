const router = require('express').Router();
const { 
    createCalendarClass, 
    getAllCalendarClasses, 
    getCalendarClassesByUserId, 
    reserveCalendarClass, 
    getCalendarClassesByUser, 
    getCalendarClassById,
    cancelClass,
    tutorcancelClass
} = require('../Controllers/CalendarClass');

        // Ruta para crear una nueva clase de calendario
        router.post('/calendar', createCalendarClass);

        // Ruta para obtener todas las clases de calendario
        router.get('/calendar', getAllCalendarClasses);

        // Ruta para obtener las clases de calendario por userId
        router.get('/calendar/:userId', getCalendarClassesByUserId);

        // Ruta para reservar una clase de calendario
        router.put('/calendar/reserve/:classId', reserveCalendarClass);

        // Ruta para obtener las clases de calendario reservadas por un estudiante dado
        router.get('/calendar/classes/:studentId', getCalendarClassesByUser);

        // Ruta para obtener una clase de calendario por su ID
        router.get('/calendar/class/:id', getCalendarClassById); 

        // Ruta para cancelar una clase de calendario por su ID
        router.delete('/calendar/Cancelclass/:id', cancelClass);

        // Ruta para cancelar una clase de calendario por su ID del tutor
        router.delete('/calendar/TutorCancelclass/:id', tutorcancelClass);

module.exports = router;
