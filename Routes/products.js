const Router = require('express').Router();
const {login}= require('../Controllers/Users')




Router.get('/login',login)



module.exports=Router;