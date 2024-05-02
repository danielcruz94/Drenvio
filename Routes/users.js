const Router = require('express').Router();
const {login,newStudent, getUsers}= require('../Controllers/Users')




Router.post('/login',login)
Router.get('/users',getUsers)
Router.post('/signup',newStudent)


module.exports=Router;