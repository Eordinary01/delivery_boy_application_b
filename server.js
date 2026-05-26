const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const orderRoutes= require('./src/routes/orderRoutes');
const assignmentsRoutes= require('./src/routes/assignmentRoutes');
const deliveryBoyRoutes= require('./src/routes/deliveryBoyRoutes');

const app = express();


const limiter = rateLimit({
  windowMs:15*60*1000,
  max:100,
  message:{
    error:'Too many requests from this IP.Please try again after 15 minutes.'
  },
  standardHeaders:true,
  legacyHeaders:false,
})
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/assignments',assignmentsRoutes);
app.use('/api/delivery-boy',deliveryBoyRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});