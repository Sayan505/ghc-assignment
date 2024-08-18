import {
    get_message_schedule,
    set_message_schedule,
} from "../config/message_schedule.config.js";


async function get_message_schedule_controller(req, res) {
    return res.status(200).send(get_message_schedule());
}

async function set_message_schedule_controller(req, res) {
    const result = set_message_schedule(req.body) ? "success" : "invalid schema";

    return res.status(200).send({ status: result });
}


export { get_message_schedule_controller, set_message_schedule_controller };
