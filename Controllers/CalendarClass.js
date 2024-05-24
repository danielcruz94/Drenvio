const CalendarClass = require('../models/CalendarClass');

const createCalendarClass = async (req, res) => {
    try {
        const { userId, date, endTime, startTime, reserved } = req.body;
        const newCalendarClass = new CalendarClass({
            userId,
            date,
            endTime,
            startTime,
            reserved
        });
        const savedClass = await newCalendarClass.save();
        res.status(201).json(savedClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllCalendarClasses = async (req, res) => {
    try {
        const calendarClasses = await CalendarClass.find().sort({ startTime: 1 });
        res.status(200).json(calendarClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCalendarClassesByUserId = async (req, res) => {
    try {
        const { userId } = req.body;
        const calendarClasses = await CalendarClass.find({ userId }).sort({ startTime: 1 });
        res.status(200).json(calendarClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const reserveCalendarClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const updatedClass = await CalendarClass.findByIdAndUpdate(classId, { reserved: true }, { new: true });
        res.status(200).json(updatedClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createCalendarClass,
    getAllCalendarClasses,
    getCalendarClassesByUserId,
    reserveCalendarClass
};
