import mongoose from "mongoose";


const Schema = mongoose.Schema;


const message_schedule_point_schema = new Schema({
    delay: { type: Number, required: true     },
    msg:   { type: String, default: undefined },
});

const message_schedule_schema = new Schema({
    config_type:      { type: String, default: "message_schedule_schema", unique: true },
    message_schedule: [message_schedule_point_schema]
});

const message_schedule_schema_model = mongoose.model("MessageSchedule", message_schedule_schema, "message_schedule");


export { message_schedule_schema_model as MessageSchedule };
