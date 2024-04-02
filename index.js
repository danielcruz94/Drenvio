const connectDB=require('./dbConnection.js')
const express=require('express');
const app=express ();
const cors=require("cors")

const productRouter=require('./Routes/products')


connectDB()
require('dotenv').config();



app.use(express.json());



console.log('shjbnsjnbsjnjnsjsnj')

app.use('/api',productRouter)

  

const PORT=3001;
app.listen(PORT,() =>{
    console.log(`server running on port ${PORT}`) ;

})

