import Ajv    from "ajv";

import logger from "../utils/logger.util.js";


const message_schedule_schema = {
    type: "array",
    minItems: 0,
    items: {
        type: "object",
        properties: {
            delay: { type: "integer", minimum: 0 },
            msg: { type: "string" } 
        },
        required: ["delay", "msg"],
        additionalProperties: false
    }
};

const message_schedule_default = [
    { delay: 30 * 60 * 1000,           msg: "1st reminder, 30mins" },
    { delay: 24 * 60 * 60 * 1000,      msg: "2nd reminder, 1 day"  },
    { delay: 3  * 24 * 60 * 60 * 1000, msg: "3rd reminder, 3 days" }
];

var current_message_schedule = message_schedule_default;


// prepare schema validator
const ajv      = new Ajv();
const validate = ajv.compile(message_schedule_schema);


function init_message_schedule() {
    // todo:
    // get from mongodb -> validate -> set_message_schedule
    // else keep it default
}


function get_message_schedule() {
    return current_message_schedule;
}

function set_message_schedule(message_schedule) {
    const valid = validate(message_schedule)
    if(valid) {
        current_message_schedule = message_schedule;
        // todo: save to mongodb
        return true;
    }

    return false;
}


export { get_message_schedule, set_message_schedule, init_message_schedule };
