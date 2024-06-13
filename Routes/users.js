const Router = require('express').Router();
const {login,newStudent, getUsers,completeInfo,getUserData,getUserById,upPhoto}= require('../Controllers/Users')




Router.post('/login',login)
Router.get('/users',getUsers)
Router.post('/signup',newStudent)
Router.post('/userinformation',completeInfo)
Router.get('/userdata',getUserData)
Router.get('/user/:id',getUserById)
Router.post('/user/update/photo',upPhoto)


module.exports=Router;