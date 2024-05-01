const { Schema, model } = require('mongoose');

const StudentSchema = new Schema({
  name: { type: String }, // Default value for name
  email: { type: String, required: true }, // Required field
  passwordHash: { type: String, required: true }, // Required field
  picture: { type: String, default: 'fotoPerfil' },  
  role: { type: String },
  joinedAt: { type: Date, default: Date.now },
  lenguage:{ type: String },
  goal:{ type: String },
  teacherRates: [String],
  appointments:[Date],
  history:[String],
  instagram:{ type: String},
  price:{type: Number,default: 5}
});




StudentSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id
    delete returnedObject._id
     delete returnedObject. __v
     delete returnedObject.passwordHash
  }


}
)


const Student = model('Student', StudentSchema);

// Exporta el modelo Student explícitamente
module.exports = Student;




