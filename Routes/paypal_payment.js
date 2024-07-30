const Router = require('express').Router();

const {createdOrder,capturedOrder,cancelOrder,statusOrder}=require('../Controllers/payments')


Router.post('/createdorder',createdOrder)
Router.get('/capturedorder',capturedOrder)
Router.get('/cancelpayment',cancelOrder)
Router.post('/statuspayment',statusOrder)



module.exports=Router;