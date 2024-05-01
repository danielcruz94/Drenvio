const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')

const User = require('../models/User');



const login =async (req, res) => {
  
  const { body } = req;
  const {email,password}=body;

const user=await User.findOne({email})

const passwordCorrect=user===null 
? false
:await bcrypt.compare(password,User.passwordHash)

if(!(user&&passwordCorrect)){
res.status(401).json({
  "error":"invalid email or password"
})
}


const userForToken={
email:user.email,
id:user._id

}

const token =jwt.sign(userForToken,process.env.SECRET)

res.send({
name:user.name,
email:user.email,
token,

})
}

const  newStudent =async (req, res) => {
    try {
        const { body } = req;
        const { name,lastName, email, password,picture,role,lenguage,goal,price,instagram } = body;

        const saltRound=10;
        const passwordHash=await bcrypt.hash(password,saltRound)
        const user = new User({
            name,
            email,
            lastName,
            passwordHash,
            role,
            picture,
            lenguage,
            goal,
            price,
            instagram
        });

        const savedUser = await user.save();
        res.json({message:"Usuario creado correctamente"});
    } catch (error) {
        console.error(error);
    }
};

const getUsers =async (req, res) => {
  
try {
  const users=await User.find()
  res.status(200).json(users)
} catch (error) {
  console.log(error)
}












}




module.exports = {
  login,
  newStudent,
  getUsers
    
};










