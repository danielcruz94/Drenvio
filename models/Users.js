const { ObjectID } = require('bson');
const { Schema, model } = require('mongoose');


const UserSchema = new Schema({
  name: { type: String }, // Default value for name
  _id:{type:ObjectID},
  priceSpecial:{type:Boolean}
 
});









const User = model('User', UserSchema);

// Exporta el modelo Student explícitamente
module.exports = User;