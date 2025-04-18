const mongoose = require('mongoose'); 

const Attendance = require('../models/History');

const CalendarClass = require('../models/CalendarClass'); 
const User = require('../models/User'); 

//CNSOS

    const handleServerError = (res, error) => {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error interno del servidor' });
    };

    // Crea una nueva entrada de asistencia
    const createAttendance = async (req, res) => {
        try {
            const { eventId, userIds } = req.body;
          
            if (!eventId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({ message: 'Faltan datos requeridos: eventId o userIds.' });
            }
       
            const existingAttendances = await Attendance.find({
                eventId,
                userId: { $in: userIds }
            });

            const existingUserIds = existingAttendances.map(attendance => attendance.userId.toString());
        
            const newUserIds = userIds.filter(userId => !existingUserIds.includes(userId));
          
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
    
    const updateAttendanceByUserId = async (req, res) => {
        try {
            const { eventId, userId } = req.params;  

          

            if (!eventId || !userId) {
                return res.status(400).json({ message: 'Faltan parámetros necesarios.' });
            }
            
            const result = await Attendance.updateMany(
                { eventId, userId, attended: false },  
                { $set: { attended: true, timestamp: new Date() } }  
            );

           
            res.status(200).json({ message: `Asistencias actualizadas: ${result.nModified}` });
        } catch (error) {
            handleServerError(res, error);
        }
    };

   // Obtiene todas las asistencias para un usuario dado y realiza consultas adicionales
    const getAttendancesByUserId = async (req, res) => {
        try {
            const { userId } = req.params;       

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario inválido.' });
            }

            const userObjectId = mongoose.Types.ObjectId(userId);
        
            const attendances = await Attendance.find({
                userId: userObjectId,
                attended: true
            }).sort({ timestamp: 1 });
            
            const totalAttendances = await Attendance.countDocuments({
                userId: userObjectId,
                attended: true
            });

        
            const eventIds = attendances.map(attendance => attendance.eventId)
                .filter(id => mongoose.Types.ObjectId.isValid(id));

        
            const calendarClasses = await CalendarClass.find({
                _id: { $in: eventIds }
            });

            const reservedUserIds = calendarClasses.flatMap(calendarClass => calendarClass.reserved)
                .filter(id => mongoose.Types.ObjectId.isValid(id));
            const calendarUserIds = calendarClasses.map(calendarClass => calendarClass.userId)
                .filter(id => mongoose.Types.ObjectId.isValid(id));
            
            const allUserIds = [...new Set([...reservedUserIds, ...calendarUserIds, userObjectId])]
                .filter(id => mongoose.Types.ObjectId.isValid(id));
    
            const users = await User.find({
                _id: { $in: allUserIds }
            }).select('name lastName role');

            res.status(200).json({
                total: totalAttendances,
                attendances,
                calendarClasses,
                users
            });
        } catch (error) {
            console.error('Error en getAttendancesByUserId:', error);
            handleServerError(res, error);
        }
    };


    //Conteo de asistencias 
    const getAttendanceCountByUserId = async (req, res) => {
        try {
            const { userId } = req.params;    
         
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario inválido.' });
            }    
         
            const userObjectId = mongoose.Types.ObjectId(userId);    
            
            const totalAttendances = await Attendance.countDocuments({
                userId: userObjectId,
                attended: true,
                paid: false
            });

            res.status(200).json({
                total: totalAttendances
            });
        } catch (error) {           
            res.status(500).json({ message: 'Error en el servidor.', error });
        }
    };

    // Controlador para actualizar el campo 'paid'
    const updatePaidStatus = async (req, res) => {
        try {
            const { userId, count } = req.params;
            const numberToUpdate = parseInt(count, 10);

            if (isNaN(numberToUpdate) || numberToUpdate <= 0) {
                return res.status(400).json({ message: 'Número de actualizaciones inválido.' });
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID de usuario inválido.' });
            }

            const userObjectId = mongoose.Types.ObjectId(userId);

            // Encuentra los documentos que coincidan con el userId y no tengan paid = true
            const attendances = await Attendance.find({ userId: userObjectId, paid: false })
                .sort({ timestamp: 1 })
                .limit(numberToUpdate);

            // Actualiza cada documento individualmente
            const updates = attendances.map(attendance =>
                Attendance.updateOne({ _id: attendance._id }, { $set: { paid: true } })
            );

            const result = await Promise.all(updates);

            res.status(200).json({
                message: 'Asistencias actualizadas correctamente.',
                updatedCount: result.length
            });
        } catch (error) {
            handleServerError(res, error);
        }
    };

    


module.exports = {
    createAttendance,
    updateAttendanceByUserId,
    getAttendancesByUserId,
    getAttendanceCountByUserId,
    updatePaidStatus

};
