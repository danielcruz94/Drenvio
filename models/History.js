const { Schema, model } = require('mongoose');

const AttendanceSchema = new Schema({
    eventId: { type: Schema.Types.ObjectId, required: true, ref: 'CalendarClass' },  
    userId: { type: String, required: true },  
    attended: { type: Boolean, required: true },  
    paid: { type: Boolean, default: false },  
    timestamp: { type: Date, default: Date.now }  
});

const Attendance = model('Attendance', AttendanceSchema);

module.exports = Attendance;
