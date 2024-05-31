const CalendarClass = require('../models/CalendarClass');

        const handleServerError = (res, error) => {
            console.error(error);
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
        };

        // Crea una nueva clase en el calendario
        const createCalendarClass = async (req, res) => {
            try {
                const { userId, date, endTime, startTime, reserved } = req.body;
                const startDateTime = new Date(startTime);
                const endDateTime = new Date(endTime);
                const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
                
                // Buscar clases existentes para el usuario en la fecha dada
                const existingClasses = await CalendarClass.find({ userId, date });
                
                // Verificar si hay alguna superposición con las clases existentes
                const overlappingClass = existingClasses.some(existingClass => {
                    return (
                        (startDateTime >= existingClass.startTime && startDateTime < existingClass.endTime) ||
                        (endDateTime > existingClass.startTime && endDateTime <= existingClass.endTime) ||
                        (startDateTime <= existingClass.startTime && endDateTime >= existingClass.endTime)
                    );
                });
                
                if (overlappingClass) {
                    return res.status(400).json({ message: "El usuario ya tiene una clase en ese rango de horas para la misma fecha." });
                }
                
                // Crear las nuevas clases
                const newCalendarClasses = [];
                for (let i = 0; i < durationHours; i++) {
                    const newStartDateTime = new Date(startDateTime.getTime() + (i * 60 * 60 * 1000));
                    const newEndDateTime = new Date(newStartDateTime.getTime() + (60 * 60 * 1000));
                    const newCalendarClass = {
                        userId,
                        date,
                        endTime: newEndDateTime.toISOString(),
                        startTime: newStartDateTime.toISOString(),
                        reserved
                    };
                    newCalendarClasses.push(newCalendarClass);
                }
                
                // Insertar las nuevas clases en la base de datos en una sola operación
                await CalendarClass.insertMany(newCalendarClasses);
                
                res.status(201).json({ message: "Clases creadas exitosamente." });
            } catch (error) {
                handleServerError(res, error);
            }
        };
        

        // Obtiene todas las clases del calendario para un usuario dado
        const getAllCalendarClasses = async (req, res) => {
            try {
                const userId = req.query.userId;
                const calendarClasses = await CalendarClass.find({ userId }).sort({ startTime: 1 });
                res.status(200).json(calendarClasses);
            } catch (error) {
                handleServerError(res, error);
            }
        };

        // Obtiene todas las clases del calendario para un usuario dado
        const getCalendarClassesByUserId = async (req, res) => {
            try {
                const { userId } = req.params;
                const calendarClasses = await CalendarClass.find({ userId }).sort({ startTime: 1 });
                res.status(200).json(calendarClasses);
            } catch (error) {
                handleServerError(res, error);
            }
        };

        // Reserva una clase del calendario
        const reserveCalendarClass = async (req, res) => {
            try {
                const { classId } = req.params;
                const { reserved } = req.body;
                if (reserved === undefined || reserved === '') {
                    console.error('El campo "reserved" está vacío o no existe en la solicitud.');
                    return res.status(400).json({ error: 'El campo "reserved" está vacío o no existe en la solicitud.' });
                }
                const updatedClass = await CalendarClass.findByIdAndUpdate(classId, { reserved: reserved }, { new: true });
                if (!updatedClass) {
                    console.error('Clase no encontrada');
                    return res.status(404).json({ error: 'Clase no encontrada' });
                }
                res.status(200).json(updatedClass);
            } catch (error) {
                console.error('Error interno del servidor:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        };

        // Obtiene todas las clases del calendario reservadas por un estudiante dado
        const getCalendarClassesByUser = async (req, res) => {
            try {
                const studentId = req.params.studentId;
                if (!studentId) {
                    throw new Error('Student ID is missing.');
                }
                const calendarClasses = await CalendarClass.find({ reserved: { $regex: new RegExp('^' + studentId + '$', 'i') } }).sort({ startTime: 1 });
                if (!calendarClasses || calendarClasses.length === 0) {
                    throw new Error('No calendar classes found for the student.');
                }
                res.status(200).json(calendarClasses);
            } catch (error) {
                handleServerError(res, error);
            }
        };

        // Obtiene una clase del calendario por su ID
        const getCalendarClassById = async (req, res) => {
            try {
                const { id } = req.params;
                const calendarClass = await CalendarClass.findById(id);
                if (!calendarClass) {
                    return res.status(404).json({ message: "No se encontró ninguna clase con el ID proporcionado." });
                }
                res.status(200).json(calendarClass);
            } catch (error) {
                handleServerError(res, error);
            }
        };

module.exports = {
    createCalendarClass,
    getAllCalendarClasses,
    getCalendarClassesByUserId,
    reserveCalendarClass,
    getCalendarClassesByUser,
    getCalendarClassById
};
