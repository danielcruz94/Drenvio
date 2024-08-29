const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./dbConnection.js');
const emailRouter = require('./Routes/email');
const usersRouter = require('./Routes/users');
const calendarRouter = require('./Routes/CalendarClass');
const UserOnline = require('./Routes/UserOnline.js');
const PaypalRouter = require('./Routes/paypalPayment.js');
const history = require('./Routes/history');
const instagramRoutes = require('./Routes/instagramR.js');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api', usersRouter);
app.use('/api', calendarRouter);
app.use('/api', UserOnline);
app.use('/api', history);
app.use('/api/email', emailRouter);
app.use('/api', PaypalRouter);
app.use('/api', instagramRoutes);

//COMENTAR LA SIGUIENTE LINEA PARA ACTIVAR EL SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
