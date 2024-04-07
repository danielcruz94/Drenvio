const mongoose=require('mongoose')
mongoose.set('strictQuery', false);
const password ='12345'

const connectionString=`mongodb+srv://daniel94cruz:${password}@cluster0.ecmhoaq.mongodb.net/Benji?retryWrites=true&w=majority&appName=Cluster0`

const connectDB=async() => {
   await mongoose.connect(connectionString)
.then(() => {
    console.log('dataBase Conected')
}).catch((error) =>{
    console.log(error)
} )
}




    


module.exports=connectDB;