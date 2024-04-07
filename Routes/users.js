const Router = require('express').Router();
const {login,newStudent}= require('../Controllers/Users')




Router.get('/login',login)
Router.post('/signup',newStudent)


module.exports=Router;