const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./dbConnection');

const Conversation = require('./models/Soporte');

// Rutas
const emailRouter = require('./Routes/email');
const usersRouter = require('./Routes/users');
const calendarRouter = require('./Routes/CalendarClass');
const UserOnline = require('./Routes/UserOnline');
const PaypalRouter = require('./Routes/paypalPayment');
const history = require('./Routes/history');
const instagramRoutes = require('./Routes/instagramR');
const wompi = require('./Routes/wompi');

const pusher = require('./lib/pusher');

const app = express();

// Conexión a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rutas de la API
app.use('/api', usersRouter);
app.use('/api', calendarRouter);
app.use('/api', UserOnline);
app.use('/api', history);
app.use('/api/email', emailRouter);
app.use('/api', PaypalRouter);
app.use('/api', instagramRoutes);
app.use('/api', wompi);

// Endpoint para obtener todas las conversaciones (soporte)
app.get('/api/conversations', async (req, res) => {
  try {
    const allConversations = await Conversation.find({});
    res.json(allConversations);
  } catch (error) {
    console.error('❌ Error al obtener conversaciones:', error);
    res.status(500).send('Error al obtener conversaciones');
  }
});

// Enviar mensaje del usuario al soporte
app.post('/api/chat/user-message', async (req, res) => {
  const { userId, message } = req.body;

  const newMessage = {
    sender: 'user',
    name: message.name,
    text: message.text,
    time: message.time
  };

  try {
    let convo = await Conversation.findOne({ userId });

    if (!convo) {
      convo = new Conversation({ userId, messages: [newMessage] });
    } else {
      convo.messages.push(newMessage);
    }

    await convo.save();

    // Emitir a canal Pusher
    await pusher.trigger('support-channel', 'chat-message', { userId, ...newMessage });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error al guardar mensaje:', error);
    res.status(500).json({ error: 'Error al guardar mensaje' });
  }
});

// Enviar mensaje del soporte al usuario
app.post('/api/chat/support-message', async (req, res) => {
  const { userId, message } = req.body;

  const newMessage = {
    sender: 'support',
    name: message.name,
    text: message.text,
    time: message.time
  };

  try {
    let convo = await Conversation.findOne({ userId });

    if (!convo) {
      convo = new Conversation({ userId, messages: [newMessage] });
    } else {
      convo.messages.push(newMessage);
    }

    await convo.save();

    // Emitir al canal del usuario y al soporte
    await pusher.trigger(`user-${userId}`, 'chat-message', { userId, ...newMessage });
    await pusher.trigger('support-channel', 'new-message', { userId, message: newMessage });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Error al guardar mensaje del soporte:', error);
    res.status(500).json({ error: 'Error al guardar mensaje' });
  }
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Puerto
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`🚀 Backend con Pusher corriendo en puerto ${port}`);
});
