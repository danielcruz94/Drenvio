const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')

const Student = require('../models/Student');



const login =async (req, res) => {
  
  const { body } = req;
  const {email,password}=body;

const student=await Student.findOne({email})

const passwordCorrect=student===null 
? false
:await bcrypt.compare(password,student.passwordHash)

if(!(student&&passwordCorrect)){
res.status(401).json({
  "error":"invalid email or password"
})
}


const userForToken={
email:student.email,
id:student._id

}

const token =jwt.sign(userForToken,process.env.SECRET)

res.send({
name:student.name,
email:student.email,
token,

})
}

const  newStudent =async (req, res) => {
    try {
        const { body } = req;
        const { name, email, password,picture,role,lenguage,goal,rol } = body;

        const saltRound=10;
        const passwordHash=await bcrypt.hash(password,saltRound)
        const student = new Student({
            name,
            email,
            passwordHash,
            role,
            picture,
            lenguage,
            goal,
            rol
        });

        const savedStudent = await student.save();
        res.json({message:"Usuario creado correctamente"});
    } catch (error) {
        console.error(error);
    }
};




module.exports = {
  login,
  newStudent
    
};










