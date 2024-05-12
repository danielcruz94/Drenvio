const Router = require('express').Router();
const {login,newStudent, getUsers,completeInfo,getUserData,getUserById}= require('../Controllers/Users')




Router.post('/login',login)
Router.get('/users',getUsers)
Router.post('/signup',newStudent)
Router.post('/userinformation',completeInfo)
Router.get('/userdata',getUserData)
Router.get('/user/:id',getUserById)


module.exports=Router;