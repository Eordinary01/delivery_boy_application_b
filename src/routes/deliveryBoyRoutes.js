const express = require("express");
const {
  getMyOrders,
  updateMyOrderStatus,
} = require("../controllers/deliveryBoyController");

const {
    verifyRole,
    verifyAccessToken,
} = require("../middleware/authMiddleware");
const { updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.use(verifyAccessToken);
router.use(verifyRole(["delivery_boy"]));

router.get("/my-orders", getMyOrders);
router.patch("/my-orders/:id/status", updateMyOrderStatus);

module.exports = router;
