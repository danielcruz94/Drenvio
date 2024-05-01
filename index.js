const connectDB=require('./dbConnection.js')
const express=require('express');
const app=express ();
const cors=require("cors")

const usersRouter=require('./Routes/users')


connectDB()
require('dotenv').config();

app.use(cors());

app.use(express.json());





app.use('/api',usersRouter)

  

const PORT=3001;
app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`) ;

})

