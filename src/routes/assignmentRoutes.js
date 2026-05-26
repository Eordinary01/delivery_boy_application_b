const express = require("express");

const {
  assignOrder,
  getDeliveryBoyOrders,
} = require("../controllers/assignmentController");
const {
  verifyRole,
  verifyAccessToken,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyAccessToken);
router.use(verifyRole(["admin"]));

router.post("/", assignOrder);
router.get("/delivery-boy/:id", getDeliveryBoyOrders);

module.exports = router;
