const Router = require('express').Router();
const {getProducts, getPriceSpecial}= require('../Controllers/getProducts')

console.log('eeijienei')


Router.get('/products',getProducts)
Router.get('/price/:user_id/:nombre_producto',getPriceSpecial)


module.exports=Router;