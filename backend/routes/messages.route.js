import express             from "express";

import messages_controller from "../controllers/messages.controller.js";


const router = express.Router();

router.get("/", messages_controller);


export default router;
