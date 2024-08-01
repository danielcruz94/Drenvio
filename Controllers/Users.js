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
        id:user._id,
        role:user.role,
        price:user.price 
        
        
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

      const getUsers = async (req, res) => {
        try {
          // Filter users by role: "student"
          const students = await User.find({ role: "Tutor" });

          // Check if students were found
          if (!students.length) {
            return res.status(404).json({ message: "No students found" });
          }

          res.status(200).json(students);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      };

      const completeInfo =async (req, res) => {
        

        const { body } = req;
        const { email,picture,role,language,goal,price,instagram,biography,country } = body;
        
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
              completeInfo:true,
              biography,
              country

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

        const getUserById = async (req, res) => {
          try {
            const { id } = req.params; // Access email from query parameters
            
            if (!id) {
              return res.status(400).json({ message: 'Missing required parameter: id' });
            }
        
            const user = await User.findById(id);
        
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
        
            res.status(200).json(user);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          }
        };

        const upPhoto = async (req, res) => {
          try {
            const { body } = req;
            const { photo, email,reference } = body; // Set default position to -1 (invalid)
        
          
        
            const user = await User.findOne({ email });
            if (user) {
            if(reference===0){
              
              user.photos.shift()
              user.photos.unshift(photo)
            }
            if(reference===2){
            
              user.photos.pop()
              user.photos.push(photo)
            }
            if(reference===1){
              user.photos=[user.photos[0],photo,user.photos[2]]
            }
            
              
            
            
            } else {
              console.log('User not found');
            }

        
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            await user.save()
          
        
            res.status(200).json(user);
          } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ message: 'Internal server error' }); // Generic error response for unexpected issues
          }
        };
  
        const updateBankDetails = async (req, res) => {
          try {
            const userId = req.params.id; // ID del usuario desde los parámetros de la URL
            const { bank, bank_account } = req.body; // Campos a actualizar desde el cuerpo de la solicitud
        
            // Validar que el ID del usuario y los campos necesarios estén presentes
            if (!userId || !bank || !bank_account) {
              return res.status(400).json({ error: 'ID de usuario, bank y bank_account son requeridos.' });
            }
        
            // Encontrar y actualizar el usuario
            const updatedUser = await User.findByIdAndUpdate(
              userId,
              { bank, bank_account },
              { new: true, runValidators: true } // Retorna el usuario actualizado y valida los datos
            );
        
            if (!updatedUser) {
              return res.status(404).json({ error: 'Usuario no encontrado.' });
            }
        
            res.json(updatedUser);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la información bancaria.' });
          }
        };
  
        // Controller to get bank details for a user
        const getBankDetails = async (req, res) => {
          try {
            const userId = req.params.id; // ID del usuario desde los parámetros de la URL

            // Encontrar al usuario por ID
            const user = await User.findById(userId).select('bank bank_account'); // Selecciona solo los campos necesarios

            if (!user) {
              return res.status(404).json({ error: 'Usuario no encontrado.' });
            }

            // Retornar los detalles bancarios del usuario
            res.json({
              bank: user.bank,
              bank_account: user.bank_account
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la información bancaria.' });
          }
        };



module.exports = {
  login,
  newStudent,
  getUsers,
  completeInfo,
  getUserData,
  getUserById,
  upPhoto,
  updateBankDetails,
  getBankDetails    
};









