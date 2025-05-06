const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./dbConnection.js');

// Importa el nuevo modelo de conversaciones
const Conversation = require('./models/Soporte');

// Rutas
const emailRouter = require('./Routes/email');
const usersRouter = require('./Routes/users');
const calendarRouter = require('./Routes/CalendarClass');
const UserOnline = require('./Routes/UserOnline.js');
const PaypalRouter = require('./Routes/paypalPayment.js');
const history = require('./Routes/history');
const instagramRoutes = require('./Routes/instagramR.js');
const wompi = require('./Routes/wompi');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

// WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Soporte se une a la sala "support"
  socket.on('join-support', () => {
    socket.join('support');
  });

  // Solicitar todas las conversaciones
  socket.on('get-all-conversations', async () => {
    try {
      const allConversations = await Conversation.find({});
      socket.emit('all-conversations', allConversations);
    } catch (error) {
      console.error('❌ Error al obtener todas las conversaciones:', error);
    }
  });

  // Usuario se une a su sala (por ID)
  socket.on('join-user', async ({ userId }) => {
    socket.join(userId);

    // Enviar historial de la conversación
    try {
      const convo = await Conversation.findOne({ userId });
      socket.emit('chat-history', convo ? convo.messages : []);
    } catch (error) {
      console.error('❌ Error al obtener conversación:', error);
    }
  });

  // Usuario envía mensaje al soporte
  socket.on('mensaje', async ({ userId, message }) => {
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

      // Emitir mensaje al soporte
      io.to('support').emit('chat-message', { userId, ...newMessage });

      // Emitir mensaje al usuario mismo
      socket.emit('chat-message', { userId, ...newMessage });

    } catch (error) {
      console.error('❌ Error al guardar mensaje del usuario:', error);
    }
  });

  // Soporte responde al usuario
  socket.on('send-to-user', async ({ userId, message }) => {
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

      // Enviar mensaje al usuario
      io.to(userId).emit('chat-message', { userId, ...newMessage });

      // Emitir el nuevo mensaje a todos los clientes conectados a "support"
      io.to('support').emit('new-message', { userId, message: newMessage });

      // Enviar mensaje a otros soportes conectados
      socket.to('support').emit('chat-message', { userId, ...newMessage });

    } catch (error) {
      console.error('❌ Error al guardar mensaje del soporte:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Un usuario se ha desconectado');
  });
});

// Puerto del servidor
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
