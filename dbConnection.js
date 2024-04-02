const mongoose=require('mongoose')
mongoose.set('strictQuery', false);
const password ='moM5f3AodwLE5d0A'

const connectionString=`mongodb://drenvio:${password}@ac-aemgtkt-shard-00-00.unqyghm.mongodb.net:27017,ac-aemgtkt-shard-00-01.unqyghm.mongodb.net:27017,ac-aemgtkt-shard-00-02.unqyghm.mongodb.net:27017/sneakers_store?replicaSet=atlas-y8oxsk-shard-0&ssl=true&authSource=admin`

const connectDB=async() => {
   await mongoose.connect(connectionString)
.then(() => {
    console.log('dataBase Conected')
}).catch((error) =>{
    console.log(error)
} )
}




    


module.exports=connectDB;