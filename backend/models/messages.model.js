import mongoose from "mongoose";


const Schema = mongoose.Schema;


const message_schema = new Schema({
    customer_id:            { type: String,  required: true     },
    customer_email:         { type: String,  default: undefined },
    checkout_created_at:    { type: Date,    default: undefined },
    notification_timestamp: { type: Date,    default: Date.now  }
});


export default mongoose.model("Message", message_schema, "messages");
