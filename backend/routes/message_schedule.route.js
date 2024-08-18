import express from "express";

import { get_message_schedule_controller, set_message_schedule_controller } from "../controllers/message_schedule.controller.js";


const router = express.Router();

router.get("/",  get_message_schedule_controller);
router.post("/", set_message_schedule_controller);


export default router;
