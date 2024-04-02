
const { findById } = require('../models/Productos');
const Product = require('../models/Productos');
const User= require('../models/Users')


 const getProducts= async (request, response) => {
    try {
        const listProducts= await Product.find()

        const filterProducts=listProducts.filter((element) =>element.inStock===true || element.stock>0 )
       
        response.status(200).json(filterProducts)
        
    } catch (error) {
        console.log(error)
        response.status(400).send(error)
    }

}

const getPriceSpecial = async (request, response) => {
    try {
      const { user_id, nombre_producto } = request.params;
      if (!(user_id || nombre_producto)) {
        return response.status(400).json({ message: "faltan datos" });
      }
  
      const userFilter = await User.findById(user_id);
  
      if (!userFilter) {
        return response.status(404).json({ message: "Usuario no encontrado" }); // Responde 404 si no hay usuario
      }
  
      const encodedNombreProducto = encodeURIComponent(nombre_producto);
      const decodedNombreProducto = decodeURIComponent(nombre_producto.replace(/\+/g, ' '));
  
      const listProducts = await Product.find({ name: decodedNombreProducto });
  
      // Si la lista de productos está vacía, significa que no se encontró el producto
      if (listProducts.length === 0) {
        return response.status(404).json({ message: "Producto no encontrado" }); // Responde 404 si no hay productos
      }
  
      const precio = userFilter.priceSpecial ? listProducts[0].specialPrice : listProducts[0].price;
  
      response.status(200).json(precio);
  
    } catch (error) {
      console.error(error);
      response.status(500).send(error);
    }
  };
  

module.exports = {
    getProducts,
    getPriceSpecial,
};










