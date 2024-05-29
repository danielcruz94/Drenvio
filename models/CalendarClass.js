const { Schema, model } = require('mongoose');

const CalendarClassSchema = new Schema({
    userId: { type: String },
    date: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    reserved: { type: String }, 
});

const CalendarClass = model('CalendarClass', CalendarClassSchema);

module.exports = CalendarClass;
