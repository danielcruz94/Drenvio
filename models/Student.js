const { Schema, model } = require('mongoose');

const StudentSchema = new Schema({
  name: { type: String }, // Default value for name
  email: { type: String, required: true }, // Required field
  passwordHash: { type: String, required: true }, // Required field
  picture: { type: String, default: 'fotoPerfil' },  
  role: { type: String, default: 'student' },
  joinedAt: { type: Date, default: Date.now },
  lenguage:{ type: String,required: true  },
  goal:{ type: String,required: true  }
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




