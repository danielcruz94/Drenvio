const { Schema, model } = require('mongoose');

const TutorSchema = new Schema({
  name: { type: String }, // Default value for name
  email: { type: String, required: true }, // Required field
  passwordHash: { type: String, required: true }, // Required field
  picture: { type: String, default: 'fotoPerfil' },  
  role: { type: String, default: 'tutor' },
  joinedAt: { type: Date, default: Date.now },
  lenguage:{ type: String,required: true  },
  Rates: [String],
  appoitnments:[Date],
  history:[String]
});




TutorSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id
    delete returnedObject._id
     delete returnedObject. __v
     delete returnedObject.passwordHash
  }


}
)


const Tutor = model('Tutor', TutorSchema);


module.exports = Tutor;




