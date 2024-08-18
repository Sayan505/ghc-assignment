import mongoose from "mongoose";


const Schema = mongoose.Schema;


const order_schema = new Schema({
    order_id:                    { type: String,  required: true     },
    order_created_at:            { type: Date,    required: true     },
    customer_id:                 { type: String,  required: true     },
    customer_email:              { type: String,  default: undefined },
    last_notified_at:            { type: Date,    default: undefined },
    is_order_placed_after_notif: { type: Boolean, default: false     }
});


export default mongoose.model("Order", order_schema, "orders");
