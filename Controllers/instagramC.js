const User = require('../models/User');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();
const FormData = require('form-data');

const clientId = '1320840705542274';
const clientSecret = 'b7eb5b15a7a56382a50793b286d94429';

// Cambiar de acuerdo a local o servidor
// const redirectUri = 'https://localhost:5173/instagram';
const redirectUri = 'https://toriiapp.netlify.app/instagram';
//const redirectUri = 'https://www.torii.com.co/';
//const redirectUri = 'https://192.168.1.51:5173/instagram';



// Configuración de multer para guardar archivos en una carpeta específica
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId || 'default';
    const uploadPath = path.join('uploads', userId);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

    // Inicia la autenticación con Instagram y devuelve la URL de redirección
    const startAuth = (req, res) => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
    res.json({ redirectUrl: authUrl }); // Devuelve la URL de redirección al cliente
    };

    // Maneja el callback de Instagram y obtiene el token de acceso
    const handleCallback = async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
        }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        });

        const accessToken = tokenResponse.data.access_token;

        const userProfileResponse = await axios.get(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`);

        res.json({
        ...userProfileResponse.data,
        access_token: accessToken,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    };

    // Obtiene todas las fotos del usuario
    const getUserMedia = async (req, res) => {
    const { accessToken } = req.query;
    if (!accessToken) {
        return res.status(400).json({ error: 'No access token provided' });
    }

    try {
        const mediaResponse = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${accessToken}`);
        res.json(mediaResponse.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    };

    // Controlador para actualizar el perfil del usuario
    const updateInstagram = async (req, res) => {
    const { userId } = req.params;
    const { photos, instagram } = req.body;

    if (!userId || !photos || !Array.isArray(photos) || typeof instagram !== 'string') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        user.photos = photos;
        user.instagram = instagram;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    };

    // Controlador para descargar y guardar imágenes   
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/danielcruz/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'ih5terca'; 

    const downloadImages = async (req, res) => {
        const { userId, imageUrls } = req.body;

        if (!userId || !imageUrls || !Array.isArray(imageUrls)) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        try {
            const imagePromises = imageUrls.slice(0, 3).map(async (url) => {
                try {
                    // Descargar la imagen
                    const response = await axios({
                        url: url,
                        responseType: 'stream',
                    });

                    // Preparar datos para la carga a Cloudinary
                    const form = new FormData();
                    form.append('file', response.data, { filename: 'image.jpg' });
                    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

                    // Subir imagen a Cloudinary
                    const uploadResponse = await axios.post(CLOUDINARY_URL, form, {
                        headers: {
                            ...form.getHeaders(),
                        },
                    });

                    return uploadResponse.data.secure_url;
                } catch (error) {
                    console.error(`Error uploading image from URL ${url}:`, error.message);
                    throw error;
                }
            });

            const fileUrls = await Promise.all(imagePromises);

            res.json({ filePaths: fileUrls });
        } catch (error) {
            console.error('Error processing images:', error.message);
            res.status(500).json({ error: 'Error processing images' });
        }
    };

module.exports = { downloadImages };


module.exports = {
  startAuth,
  handleCallback,
  getUserMedia,
  updateInstagram,
  downloadImages
};
