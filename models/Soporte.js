// models/Conversation.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'user' o 'support'
  name: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
