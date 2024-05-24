const connectDB=require('./dbConnection.js')
const express=require('express');
const app=express ();
const cors=require("cors")
const emailRouter =require('./Routes/email');

const usersRouter=require('./Routes/users');
const calendarRouter = require('./Routes/CalendarClass'); 


connectDB()
require('dotenv').config();

app.use(cors());

app.use(express.json());





app.use('/api',usersRouter)
app.use('/api', calendarRouter);

app.use('/api/email', emailRouter)

const PORT=3001;
app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`) ;

})

