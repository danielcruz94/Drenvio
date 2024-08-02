const mongoose = require('mongoose'); // Para CommonJS

const Attendance = require('../models/History'); // Ajusta la ruta según sea necesario

const CalendarClass = require('../models/CalendarClass'); // Modelo para el calendario
const User = require('../models/User'); // Modelo para los usuarios

    const handleServerError = (res, error) => {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    };

    // Crea una nueva entrada de asistencia
    const createAttendance = async (req, res) => {
        try {
            const { eventId, userIds } = req.body;

            // Verificar que se han proporcionado eventId y userIds
            if (!eventId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({ message: 'Faltan datos requeridos: eventId o userIds.' });
            }

            // Buscar asistencias existentes para el eventId y los userIds
            const existingAttendances = await Attendance.find({
                eventId,
                userId: { $in: userIds }
            });

            // Obtener los userIds que ya tienen asistencia registrada
            const existingUserIds = existingAttendances.map(attendance => attendance.userId.toString());

            // Filtrar los userIds que no tienen asistencia registrada
            const newUserIds = userIds.filter(userId => !existingUserIds.includes(userId));

            // Crear nuevas instancias de asistencia solo para los userIds que no están registrados
            const attendances = [];
            for (const userId of newUserIds) {
                const newAttendance = new Attendance({
                    eventId,
                    userId,
                    attended: false,
                    timestamp: new Date()
                });

                attendances.push(newAttendance);
            }

            // Guardar en la base de datos solo los nuevos documentos
            if (attendances.length > 0) {
                await Attendance.insertMany(attendances);
            }

            res.status(201).json({
                message: 'Asistencias creadas exitosamente.',
                createdAttendances: attendances,
                existingAttendancesCount: existingAttendances.length
            });
        } catch (error) {
            handleServerError(res, error);
        }
    };

    // Actualiza el campo "attended" a true para todas las asistencias de un usuario específico
    const updateAttendanceByUserId = async (req, res) => {
        try {
            const { eventId, userId } = req.params;  // Obtener ambos parámetros de la URL

            if (!eventId || !userId) {
                return res.status(400).json({ message: 'Faltan parámetros necesarios.' });
            }

            // Actualiza las asistencias donde coincidan tanto el eventId como el userId y el campo attended es false
            const result = await Attendance.updateMany(
                { eventId, userId, attended: false },  // Buscar registros que coincidan con ambos parámetros y attended: false
                { $set: { attended: true, timestamp: new Date() } }  // Actualizar el campo "attended" y la fecha
            );

            // Enviar la respuesta con el número de documentos modificados
            res.status(200).json({ message: `Asistencias actualizadas: ${result.nModified}` });
        } catch (error) {
            handleServerError(res, error);
        }
    };

    // Obtiene todas las asistencias para un usuario dado y realiza consultas adicionales
    const getAttendancesByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
            console.log(userId);

            // Validar si userId es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario inválido.' });
            }

            // Convertir userId a ObjectId
            const userObjectId = mongoose.Types.ObjectId(userId);

            // 1. Buscar asistencias para el usuario especificado
            const attendances = await Attendance.find({
                userId: userObjectId,
                attended: true
            }).sort({ timestamp: 1 });

            // 2. Contar el total de asistencias que cumplen con los criterios
            const totalAttendances = await Attendance.countDocuments({
                userId: userObjectId,
                attended: true
            });

            // 3. Extraer los IDs de los eventos desde las asistencias
            const eventIds = attendances.map(attendance => attendance.eventId);

            // 4. Consultar todas las clases en el calendario donde _id está en eventIds
            const calendarClasses = await CalendarClass.find({
                _id: { $in: eventIds }
            });

            // 5. Extraer los IDs de usuarios reservados y userId desde las clases del calendario
            const reservedUserIds = calendarClasses.flatMap(calendarClass => calendarClass.reserved);
            const calendarUserIds = calendarClasses.map(calendarClass => calendarClass.userId);
            
            // Combinar ambos arrays en uno solo y eliminar duplicados
            const allUserIds = [...new Set([...reservedUserIds, ...calendarUserIds, userObjectId])];

            // 6. Consultar todos los usuarios relacionados con estos IDs
            const users = await User.find({
                _id: { $in: allUserIds }

            }).select('name lastName role');

            // 7. Enviar la respuesta con los datos obtenidos
            res.status(200).json({
                total: totalAttendances,
                attendances,
                calendarClasses,
                users
            });
        } catch (error) {
            handleServerError(res, error);  // Manejo de errores
        }
    };

    //Conteo de asistencias 
    const getAttendanceCountByUserId = async (req, res) => {
        try {
            const { userId } = req.params;
    
            // Validar si userId es un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario inválido.' });
            }
    
            // Convertir userId a ObjectId
            const userObjectId = mongoose.Types.ObjectId(userId);
    
            // Contar el total de asistencias que cumplen con los criterios
            const totalAttendances = await Attendance.countDocuments({
                userId: userObjectId,
                attended: true
            });
    
            // Enviar la respuesta con el total de asistencias
            res.status(200).json({
                total: totalAttendances
            });
        } catch (error) {
            // Manejo de errores
            res.status(500).json({ message: 'Error en el servidor.', error });
        }
    };
    


module.exports = {
    createAttendance,
    updateAttendanceByUserId,
    getAttendancesByUserId,
    getAttendanceCountByUserId
};
