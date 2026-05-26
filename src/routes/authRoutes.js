const express = require('express');
const { register,login,refresh,logout } = require('../controllers/authController');
const{verifyAccessToken} = require('../middleware/authMiddleware')
const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.post('/refresh',refresh);
router.post('logout',verifyAccessToken,logout);

module.exports = router;