import express           from "express";

import orders_controller from "../controllers/orders.controller.js";


const router = express.Router();

router.get("/", orders_controller);


export default router;
