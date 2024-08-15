const User = require('../models/User');
const axios = require('axios');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const clientId = '1320840705542274';
const clientSecret = 'b7eb5b15a7a56382a50793b286d94429';

// Cambiar de acuerdo a local o servidor
// const redirectUri = 'https://localhost:5173/instagram';
 const redirectUri = 'https://toriiapp.netlify.app/instagram';
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
    const downloadImages = async (req, res) => {
        const { userId, imageUrls } = req.body;
    
        if (!userId || !imageUrls || !Array.isArray(imageUrls)) {
        return res.status(400).json({ error: 'Invalid input data' });
        }
    
        const baseUrl = 'https://torii-tau.vercel.app/uploads/'; 
        const userDir = path.join('uploads', userId);
    
        try {
        
        if (fs.existsSync(userDir)) {
        
            const existingFiles = fs.readdirSync(userDir);  
        
            existingFiles.forEach(file => {
            fs.unlinkSync(path.join(userDir, file));
            });
        } else {
            
            fs.mkdirSync(userDir, { recursive: true });
        }  
        
        const imagePromises = imageUrls.slice(0, 3).map(async (url, index) => {
            const response = await axios({
            url: url,
            responseType: 'stream',
            });
    
            const filePath = path.join(userDir, `image_${index}.jpg`);
            response.data.pipe(fs.createWriteStream(filePath));
    
            return new Promise((resolve, reject) => {
            response.data.on('end', () => resolve(filePath));
            response.data.on('error', reject);
            });
        });
    
        const filePaths = await Promise.all(imagePromises);
    
        const fileUrls = filePaths.map(filePath => {
            const relativePath = path.relative('uploads', filePath).replace(/\\/g, '/');
            return `${baseUrl}${relativePath}`;
        });
    
        res.json({ filePaths: fileUrls });
        } catch (error) {
        console.error('Error downloading images:', error.message);
        res.status(500).json({ error: 'Error downloading images' });
        }
    };
    

module.exports = {
  startAuth,
  handleCallback,
  getUserMedia,
  updateInstagram,
  downloadImages
};
