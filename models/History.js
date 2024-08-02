const { Schema, model } = require('mongoose');

const AttendanceSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, required: true, ref: 'CalendarClass' },  // Referencia al ID del evento
    userId: { type: String, required: true },  // ID del usuario
    attended: { type: Boolean, required: true },  // Estado de asistencia
    timestamp: { type: Date, default: Date.now }  // Fecha y hora de la marca de asistencia
});

const Attendance = model('Attendance', AttendanceSchema);

module.exports = Attendance;
