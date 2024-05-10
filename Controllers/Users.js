const bcrypt=require('bcrypt')
const jwt= require('jsonwebtoken')

const User = require('../models/User');



const login =async (req, res) => {
  
  const { body } = req;
  const {email,password}=body;
  
try{
const user=await User.findOne({email})
const passwordCorrect=user===null 
? false
:await bcrypt.compare(password,user.passwordHash)





if(!(user&&passwordCorrect)){
res.status(401).json({ error:"Invalid Email or Password"})

}else{
  
  const userForToken={
  email:user.email,
  id:user._id
  }
  const expiresIn = 60 * 60; // 1 hour



  const token =jwt.sign(userForToken,process.env.SECRET,{expiresIn})
  
  res.send({
  name:user.name,
  email:user.email,
  token,
  
  
})



  }


  
  
} catch (error) {
  res.send(error)
}




  
}








const  newStudent =async (req, res) => {
    try {
        const { body } = req;
        const { name,lastName, email, password } = body;

        const saltRound=10;
        const passwordHash=await bcrypt.hash(password,saltRound)
        const user = new User({
            name,
            email,
            lastName,
            passwordHash,
            
           
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

const completeInfo =async (req, res) => {
  

  const { body } = req;
  const { email,picture,role,language,goal,price,instagram } = body;
  try {
    const updateUser=await User.findOneAndUpdate(
      { email:email}, // Buscar por correo electrónico
      { $set: { 
        role,
        language,
        goal,
        price,
        instagram,
        picture,
        completeInfo:true

       } }, // Establecer el nuevo nombre
      { new: true })
     
    res.status(200).json(updateUser)

 

  } catch (error) {
    console.log(error)
  }
  
  }
  const getUserData = async (req, res) => {
    try {
      const { email } = req.query; // Access email from query parameters
      
      if (!email) {
        return res.status(400).json({ message: 'Missing required parameter: email' });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };






module.exports = {
  login,
  newStudent,
  getUsers,
  completeInfo,
  getUserData
    
};










