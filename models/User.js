const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String },
  lastName:{ type: String }, // Default value for name
  email: { type: String, required: true }, // Required field
  passwordHash: { type: String, required: true }, // Required field
  picture: { type: String, default: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg' },  
  role: { type: String },
  joinedAt: { type: Date, default: Date.now },
  language:{ type: String },
  goal:{ type: String },
  teacherRates: [String],
  appointments:[Date],
  history:[String],
  instagram:{ type: String},
  price:{type: String},
  completeInfo:{type:Boolean,default:false}
});




UserSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id
    delete returnedObject._id
     delete returnedObject. __v
     delete returnedObject.passwordHash
  }


}
)


const User = model('User', UserSchema);

// Exporta el modelo Student explícitamente
module.exports = User;




