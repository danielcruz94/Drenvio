const Router = require('express').Router();

const {createdOrder,capturedOrder,cancelOrder}=require('../Controllers/payments')


Router.get('/createdorder',createdOrder)
Router.get('/capturedorder',capturedOrder)
Router.get('/cancelpayment',cancelOrder)



module.exports=Router;