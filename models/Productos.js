const { Schema, model } = require('mongoose');


const ProductSchema = new Schema({
  name: { type: String }, // Default value for name
  description: { type: String, required: true }, // Required field
  basePrice: { type: Number, required: true }, // Required field
  inStock: { type: Boolean, }, 
  stock:{type: Number} ,
  brand: { type: String,  },
  specialPrice:{type:Number}
 
});









const Product = model('Product', ProductSchema);

// Exporta el modelo Student explícitamente
module.exports = Product;




