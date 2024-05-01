const Router = require('express').Router();
const {login,newStudent, getUsers}= require('../Controllers/Users')




Router.get('/login',login)
Router.get('/users',getUsers)
Router.post('/signup',newStudent)


module.exports=Router;