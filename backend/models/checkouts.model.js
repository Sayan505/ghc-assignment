import mongoose from "mongoose";


const Schema = mongoose.Schema;


const checkout_schema = new Schema({
    checkout_id:         { type: String,  required: true      },
    customer_id:         { type: String,  required: true      },
    customer_email:      { type: String,  default: undefined  },
    checkout_created_at: { type: Date,    default: Date.now   },
    notified_ntimes:     { type: Number,  default: 0          },
    last_notified_at:    { type: Date,    default: undefined  },
    is_order_placed:     { type: Boolean, default: false      }
});


export default mongoose.model("Checkout", checkout_schema, "checkouts");
