const CalendarClass = require('../models/CalendarClass');
const User = require('../models/User'); 

        const handleServerError = (res, error) => {
            console.error(error);
            res.status(500).json({ error: error.message || 'Error interno del servidor' });
        };

        // Crea una nueva clase en el calendario
        const createCalendarClass = async (req, res) => {
            try {
                const { userId, date, endTime, startTime, reserved, price } = req.body;
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
                        price,
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
                const { reserved, price } = req.body;
        
                // Validación de los campos necesarios
                if (reserved === undefined || reserved === '') {                   
                    return res.status(400).json({ error: 'El campo "reserved" está vacío o no existe en la solicitud.' });
                }
        
                // Si el campo price es necesario, puedes validar también
                if (price === undefined || isNaN(price)) {                    
                    return res.status(400).json({ error: 'El campo "price" está vacío o no es un número.' });
                }
        
                const updatedClass = await CalendarClass.findByIdAndUpdate(
                    classId,
                    { reserved: reserved, price: price }, // Actualizando ambos campos
                    { new: true }
                );
        
                if (!updatedClass) {
                 
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
      
       // Cancelar Clase
       const cancelClass = async (req, res) => {
        const { id } = req.params;
        const utcDateTime = new Date(req.query.utcDate);
    
        try {
            const calendarClass = await CalendarClass.findById(id);
    
            if (!calendarClass) {
                return res.status(404).json({
                    message: 'Clase no encontrada'
                });
            }
    
            const startTime = new Date(calendarClass.startTime);
            const timeDifference = Math.abs(startTime - utcDateTime);
            const oneHourInMillis = 60 * 60 * 1000;
    
            if (timeDifference > oneHourInMillis) {
                const reservedUserId = calendarClass.reserved; // ID del usuario reservado
    
                // Calcular puntos basado en el price de la clase
                const points = calendarClass.price * 100;                    
    
                // Limpiar el campo reservado y establecer price a 0
                calendarClass.reserved = '';
                calendarClass.price = 0;  // Cambiar el precio a 0
                await calendarClass.save();
    
                // Obtener el usuario reservado
                const reservedUser = await User.findById(reservedUserId);
                if (!reservedUser) {
                    return res.json({
                        message: 'Clase cancelada, pero no se encontró el usuario reservado'
                    });
                }
    
                // Sumar puntos al usuario reservado
                reservedUser.points += points;
                await reservedUser.save();
    
                return res.json({
                    message: 'Clase cancelada',
                    points: reservedUser.points
                });
            } else {
                return res.json({
                    message: 'No es posible cancelar la clase'
                });
            }
        } catch (error) {
            console.error('Error en la cancelación de la clase:', error);
            return res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    };
    




module.exports = {
    createCalendarClass,
    getAllCalendarClasses,
    getCalendarClassesByUserId,
    reserveCalendarClass,
    getCalendarClassesByUser,
    getCalendarClassById,
    cancelClass
};
