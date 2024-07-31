const { Schema, model } = require('mongoose');

const AttendanceSchema = new Schema({
    eventId: { type: String }, 
    userId: { type: String },  
    attended: { type: Boolean }, 
    timestamp: { type: Date },  
});

const Attendance = model('Attendance', AttendanceSchema);

module.exports = Attendance;
