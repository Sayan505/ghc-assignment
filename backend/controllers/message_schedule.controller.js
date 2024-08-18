import {
    get_message_schedule,
    set_message_schedule,
    message_schedule_schema_ajv
} from "../config/message_schedule.config.js";


async function get_message_schedule_controller(req, res) {
    return res.status(200).send(get_message_schedule());
}

async function set_message_schedule_controller(req, res) {
    const result = set_message_schedule(req.body);
    return res.status(200).send({result});
}


export { get_message_schedule_controller, set_message_schedule_controller };
