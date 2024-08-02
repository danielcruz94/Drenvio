const connectDB=require('./dbConnection.js')
const express=require('express');
const app=express ();
const cors=require("cors")
const emailRouter =require('./Routes/email');

const usersRouter=require('./Routes/users');
const calendarRouter = require('./Routes/CalendarClass'); 
const UserOnline = require('./Routes/UserOnline.js'); 
const History = require('./Routes/history.js'); 


connectDB()
require('dotenv').config();

//app.use(cors());
const allowedOrigins = ['https://192.168.1.51:5173', 'https://toriiapp.netlify.app/'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


app.use(express.json());





app.use('/api', usersRouter)
app.use('/api', calendarRouter);
app.use('/api', UserOnline);
app.use('/api', History);
app.use('/api/email', emailRouter)
app.use('/api',PaypalRouter );

const port= process.env.PORT|| 3001;
app.listen(port,() =>{
    console.log(`server running on port ${port}`) ;

})

