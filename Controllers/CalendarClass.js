const CalendarClass = require('../models/CalendarClass');
const User = require('../models/User'); 
const mongoose = require('mongoose');

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
                
                // Asegurarse de que startDateTime tenga los segundos y milisegundos en 0
                startDateTime.setSeconds(0);
                startDateTime.setMilliseconds(0);
        
                // Asegurarse de que endDateTime tenga los segundos y milisegundos en 0
                endDateTime.setSeconds(0);
                endDateTime.setMilliseconds(0);
                
                const durationHours = (endDateTime - startDateTime) / (1000 * 60 * 60);
                
                // Buscar clases existentes para el usuario
                const existingClasses = await CalendarClass.find({ userId });
        
                // Crear las nuevas clases
                const newCalendarClasses = [];
                for (let i = 0; i < durationHours; i++) {
                    // Crear un nuevo startDateTime para cada hora y asegurarse que los segundos estén en 0
                    const newStartDateTime = new Date(startDateTime.getTime() + (i * 60 * 60 * 1000));
                    
                    // Establecer los segundos y milisegundos en 0 para el nuevo startDateTime
                    newStartDateTime.setSeconds(0);
                    newStartDateTime.setMilliseconds(0);
        
                    // Verificar si el startTime de la nueva clase ya existe en las clases existentes
                    const overlap = existingClasses.some(existingClass => {
                        return newStartDateTime.getTime() === new Date(existingClass.startTime).getTime();
                    });
        
                    // Si no hay superposición, crear la nueva clase
                    if (!overlap) {
                        const newEndDateTime = new Date(newStartDateTime.getTime() + (60 * 60 * 1000));  // 1 hora de duración
                        
                        // Establecer los segundos y milisegundos en 0 para el nuevo endDateTime
                        newEndDateTime.setSeconds(0);
                        newEndDateTime.setMilliseconds(0);
        
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
                }
        
                // Verificar si se han creado nuevas clases
                if (newCalendarClasses.length === 0) {
                    return res.status(200).json({ message: "No se han agregado nuevas clases debido a que los horarios no estan disponibles." });
                }
        
                // Insertar las nuevas clases en la base de datos
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
        console.log(id)
    
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
    

      // Cancelar Clase tutor    
      const tutorcancelClass = async (req, res) => {
        const { id } = req.params;
        const { startTime } = req.query;    
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID de clase no válido' });
        }    
       
        if (!startTime) {
            return res.status(400).json({ message: 'Se requiere startTime' });
        }
    
        const classStartTime = new Date(startTime);
        if (isNaN(classStartTime.getTime())) {
            return res.status(400).json({ message: 'Formato de startTime no válido' });
        }
    
        try {
            
            const calendarClass = await CalendarClass.findById(id);
    
            if (!calendarClass) {
                return res.status(404).json({ message: 'Clase no encontrada' });
            }
            
            if (calendarClass.cancel === undefined || calendarClass.cancel === false) {
                calendarClass.cancel = true;
            }
                
            await calendarClass.save();    
           
            const reservedUserId = calendarClass.reserved; 
            if (reservedUserId) {
            
                const points = calendarClass.price * 100;    
               
                const reservedUser = await User.findById(reservedUserId);
                if (reservedUser) {
                   
                    reservedUser.points += points;
                    await reservedUser.save();
                   
                    return res.json({
                        message: 'Clase cancelada...',
                        points: reservedUser.points,
                        class: calendarClass
                    });
                } else {
                    return res.json({
                        message: 'Clase cancelada...'
                    });
                }
            } else {
                return res.json({
                     message: 'Clase cancelada...'
                });
            }
    
        } catch (error) {
            console.error('Error al cancelar la clase:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    };
    
    



module.exports = {
    createCalendarClass,
    getAllCalendarClasses,
    getCalendarClassesByUserId,
    reserveCalendarClass,
    getCalendarClassesByUser,
    getCalendarClassById,
    cancelClass,
    tutorcancelClass
};
