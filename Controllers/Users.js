
const { findById } = require('../models/Productos');
const Student = require('../models/Student');



const login =async (request, response) => {
  
  const { body } = request;
  const {email,password}=body;

const student=await Student.findOne({email})

const passwordCorrect=student===null 
? false
:await bcrypt.compare(password,student.passwordHash)

if(!(student&&passwordCorrect)){
response.status(401).json({
  "error":"invalid email or password"
})
}


const userForToken={
email:student.email,
id:student._id

}

const token =jwt.sign(userForToken,process.env.SECRET)

response.send({
name:student.name,
email:student.email,
token,

})
}




module.exports = {
  login,
    
};










