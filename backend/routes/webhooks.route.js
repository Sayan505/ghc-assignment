import express from "express";

import checkout_abandoned_webhook_controller from "../controllers/checkout_abandoned_webhook.controller.js";
import order_placed_webhook_controller       from "../controllers/order_placed_webhook.controller.js";


const router = express.Router();

router.post("/checkout-abandoned", checkout_abandoned_webhook_controller);
router.post("/order-placed",       order_placed_webhook_controller);


export default router;
