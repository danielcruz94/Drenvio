const Router = require('express').Router();
const {login,newStudent, getUsers,completeInfo}= require('../Controllers/Users')




Router.post('/login',login)
Router.get('/users',getUsers)
Router.post('/signup',newStudent)
Router.post('/userinformation',completeInfo)


module.exports=Router;