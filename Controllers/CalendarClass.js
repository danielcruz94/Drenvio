const CalendarClass = require('../models/CalendarClass');

const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
};

const createCalendarClass = async (req, res) => {
    try {
        const { userId, date, endTime, startTime, reserved } = req.body;
        
        // Verificar si ya existe una clase para el mismo userId y fecha
        const existingClasses = await CalendarClass.find({
            userId,
            date
        });

        // Verificar si existe alguna clase en el mismo rango de horas
        const overlappingClass = existingClasses.find(existingClass => {
            return (
                (startTime >= existingClass.startTime && startTime < existingClass.endTime) ||
                (endTime > existingClass.startTime && endTime <= existingClass.endTime) ||
                (startTime <= existingClass.startTime && endTime >= existingClass.endTime)
            );
        });

        // Si existe una clase que se superpone, responder con un mensaje
        if (overlappingClass) {
            return res.status(400).json({ message: "El usuario ya tiene una clase en ese rango de horas para la misma fecha." });
        }

        // Si no hay superposición, crear una nueva instancia de CalendarClass y guardarla
        const newCalendarClass = new CalendarClass({
            userId,
            date,
            endTime,
            startTime,
            reserved
        });

        const savedClass = await newCalendarClass.save();
        res.status(201).json(savedClass);
    } catch (error) {
        handleServerError(res, error);
    }
};

const getAllCalendarClasses = async (req, res) => {
    try {
        const userId = req.query.userId; // Se espera recibir el userId en la solicitud
        
        // Se realiza la búsqueda en la base de datos filtrando por userId
        const calendarClasses = await CalendarClass.find({ userId }).sort({ startTime: 1 });
        
        res.status(200).json(calendarClasses);
    } catch (error) {
        handleServerError(res, error);
    }
};

const getCalendarClassesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const calendarClasses = await CalendarClass.find({ userId }).sort({ startTime: 1 });
        res.status(200).json(calendarClasses);
    } catch (error) {
        handleServerError(res, error);
    }
};

const reserveCalendarClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { reserved } = req.body;

        // Verificar si el campo 'reserved' está vacío o no existe
        if (reserved === undefined || reserved === '') {
            console.error('El campo "reserved" está vacío o no existe en la solicitud.');
            return res.status(400).json({ error: 'El campo "reserved" está vacío o no existe en la solicitud.' });
        }

        const updatedClass = await CalendarClass.findByIdAndUpdate(classId, { reserved }, { new: true });

        if (!updatedClass) {
            console.error('Clase no encontrada');
            return res.status(404).json({ error: 'Clase no encontrada' });
        }

        console.log('Clase actualizada:', updatedClass);
        res.status(200).json(updatedClass);
    } catch (error) {
        console.error('Error interno del servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getCalendarClassesByUser = async (req, res) => {
    try {
        const studentId = req.params.studentId; // No se convierte a minúsculas

        console.log(studentId)

        if (!studentId) {
            throw new Error('Student ID is missing.');
        }

        console.log("Student ID received:", studentId);

        const calendarClasses = await CalendarClass.find({ reserved: { $regex: new RegExp('^' + studentId + '$', 'i') } }).sort({ startTime: 1 });

       

        if (!calendarClasses || calendarClasses.length === 0) {
            throw new Error('No calendar classes found for the student.');
        }

        res.status(200).json(calendarClasses);
    } catch (error) {
        handleServerError(res, error);
    }
};



  




module.exports = {
    createCalendarClass,
    getAllCalendarClasses,
    getCalendarClassesByUserId,
    reserveCalendarClass,
    getCalendarClassesByUser
};
