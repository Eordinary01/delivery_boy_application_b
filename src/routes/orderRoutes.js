const express = require('express');
const{
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

const {verifyAccessToken, verifyRole} = require('../middleware/authMiddleware')

const router = express.Router();

router.use(verifyAccessToken);
router.use(verifyRole(['admin']));

router.post('/',createOrder);
router.get('/',getAllOrders);
router.get('/:id',getOrderById);
router.patch('/:id/status',updateOrderStatus);

module.exports= router;