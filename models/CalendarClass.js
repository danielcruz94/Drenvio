const { Schema, model } = require('mongoose');

const CalendarClassSchema = new Schema({
    userId: { type: String },
    date: { type: Date },
    startTime: { type: Date },
    endTime: { type: Date },
    price: { type: Number, default: 0 },
    reserved: { type: String }, 
    cancel: { type: String }, 
});

const CalendarClass = model('CalendarClass', CalendarClassSchema);

module.exports = CalendarClass;
