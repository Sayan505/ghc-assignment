import Ajv   from "ajv";

import logger from "../utils/logger.util.js";

import { MessageSchedule } from "../models/configs.model.js";


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


async function init_message_schedule() {
    const result = await fetch_message_schedule();
    if(!result) {
        logger.info(`[no valid message schedule schema found on db - using default message schedule]`);
        await set_message_schedule(message_schedule_default);
    }
}

async function fetch_message_schedule() {
    // get schema from db 
    const message_schedule_config_remote = await MessageSchedule.findOne();
    if(message_schedule_config_remote) {
        const message_schedule_remote = message_schedule_config_remote.message_schedule;

        //then parse it
        var parsed_message_schedule_remote = [];

        // only consider delay and msg fields (ignoring internal mongodb fields like _id, etc)
        for(let i in message_schedule_remote) {
            let message_schedule_point = {
                delay: message_schedule_remote[i].delay,
                msg: message_schedule_remote[i].msg
            }

            parsed_message_schedule_remote.push(message_schedule_point);
        }

        // then validate it
        const valid = validate(parsed_message_schedule_remote);
        if(valid) {
            // then set it to current message schedule
            current_message_schedule = parsed_message_schedule_remote;
            logger.info(`[message schedule schema loaded from db]`);

            return true
        }
    }


    return false;
}


function get_message_schedule() {
    return current_message_schedule;
}

async function set_message_schedule(message_schedule) {
    // validate
    const valid = validate(message_schedule);
    if(valid) {
        // set it as current
        current_message_schedule = message_schedule;
        
        // then upsert the new config to db
        const message_schedule_remote = new MessageSchedule({
            message_schedule: message_schedule
        }).toObject();
        delete message_schedule_remote._id;

        await MessageSchedule.replaceOne({ config_type: "message_schedule_schema" }, message_schedule_remote, { upsert: true });

        logger.info(`[applied new message schedule]`);

        return true;
    }


    // else ignore
    logger.info(`[ignored attempt to set an invalid message schedule]`);

    return false;
}


export { get_message_schedule, set_message_schedule, init_message_schedule };
