const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  name: { type: String },
  lastName:{ type: String }, // Default value for name
  email: { type: String, required: true }, // Required field
  passwordHash: { type: String, required: true }, // Required field
  picture: { type: String, default: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg' },  
  photos: {type:[]},
  role: { type: String },
  joinedAt: { type: Date, default: Date.now },
  language:{ type: String },
  goal:{ type: String },
  teacherRates: [String],
  appointments:[Date],
  history:[String],
  instagram:{ type: String},
  country:{ type: String},
  connectedHours:{type:Number,default:0},
  price:{type: String},
  teacherRates: [String],
  completeInfo:{type:Boolean,default:false},
  biography:{type: String,default:'¡Hola! Soy un apasionado/a de la conversación, los idiomas y los viajes. Me encanta conocer personas nuevas, aprender sobre diferentes culturas y explorar el mundo.Creo que la mejor manera de aprender un idioma es a través de la interacción con hablantes nativos, por eso me encantaría conversar contigo. También disfruto mucho aprendiendo sobre diferentes culturas y tradiciones. He tenido la suerte de viajar a muchos lugares diferentes y siempre estoy buscando nuevas aventuras.Si buscas un espacio para conversar, aprender un nuevo idioma o compartir tu pasión'}
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




