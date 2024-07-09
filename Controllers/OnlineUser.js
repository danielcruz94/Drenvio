const mongoose = require('mongoose'); // Añadir esta línea al inicio del archivo
const User = require('../models/OnlineUser'); // Asegúrate de ajustar la ruta según tu estructura de archivos

const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
};

    const addUser = async (req, res) => {
        try {
            const { userId } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ userId });

            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe.' });
            }

            // Crear un nuevo usuario
            const newUser = await User.create({ userId });

            res.status(201).json({ message: 'Usuario creado exitosamente.' });
        } catch (error) {
            handleServerError(res, error);
        }
    };

     // Agregar un usuario por su ID
    const addId = async (req, res) => {
        try {
            const { id } = req.params;
    
            // Verificar si el ID ya existe
            const existingItem = await User.findOne({ userId: id });
    
            if (existingItem) {
                return res.status(201).json({ message: 'El id ya existe en la base de datos.' });
            }
            
            // Crear el nuevo item solo si no existe
            const newItem = await User.create({ userId: id });
    
            res.status(201).json({ message: 'Id agregado exitosamente.' });
        } catch (error) {
            handleServerError(res, error); // Maneja el error utilizando el manejador de errores si es necesario
        }
    };    
   
    // Consultar un usuario por su ID
    const getUserById = async (req, res) => {
        const userId = req.params.id;
        
        try {          
             console.log(userId)
            // Verificar la existencia del usuario por su userId
            const user = await User.findOne({ userId });
            console.log(user)
            // Devolver true si el usuario existe, false si no existe
            if (user) {
                return res.status(200).json({ exists: true });
            } else {
                return res.status(200).json({ exists: false });
            }
        } catch (error) {
            handleServerError(res, error);
        }
    };
    
    

    // Eliminar un usuario por su ID
    const deleteUserById = async (req, res) => {
        try {
            const { userId } = req.params;

            // Buscar y eliminar el usuario
            const deletedUser = await User.findOneAndDelete({ userId });
            if (!deletedUser) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
        } catch (error) {
            handleServerError(res, error);
        }
    };

module.exports = {
    addUser,
    addId,
    getUserById,
    deleteUserById
};
