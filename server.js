const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});