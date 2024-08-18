const message_schedule_schema_ajv = {
    type: "array",
    items: {
        type: "object",
        properties: {
            delay: { type: "integer" },
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


const message_schedule_quick = [
    { delay: 2000,  msg: "1st reminder, 2s"  }, 
    { delay: 6000,  msg: "2nd reminder, 6s"  }, 
    { delay: 12000, msg: "3rd reminder, 12s" }
];


var current_message_schedule = message_schedule_quick;

function get_message_schedule() {
    return current_message_schedule;
}

function set_message_schedule(message_schedule) {
    // TODO: validate
    current_message_schedule = message_schedule;
    return 1;
}


export { get_message_schedule, set_message_schedule, message_schedule_schema_ajv };
