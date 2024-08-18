import logger           from "../utils/logger.util.js";

import enqueue_message  from "../utils/enqueue_message.util.js";

import { get_message_schedule } from "../config/message_schedule.config.js";

import Checkout         from "../models/checkouts.model.js";
import Message          from "../models/messages.model.js";


// when sending the msg, we check if the user has placed the order or not
// if not then send the msg and enqueue the next in the schedule and repeat,
// else, don't enqueue further msgs to be sent
export default async function send_message(job) {
    const customer_id         = job.data.customer_id;
    const customer_email      = job.data.customer_email;
    const checkout_created_at = job.data.checkout_created_at;

    const checkout = await Checkout.findOne({ customer_id: customer_id });
    if(!checkout) { return };

    // dont show notif if order is placed
    if(checkout.is_order_placed) {
        logger.info(`[showing notification cancelled for customer.id: ${customer_id}]`);
        return;
    };

    // send the msg: store in db and to logger (assumed)
    const message = new Message({
        customer_id:         customer_id,
        customer_email:      customer_email,
        checkout_created_at: checkout_created_at
    });
    await message.save();
    await Checkout.updateOne({ customer_id: customer_id }, { $inc: { notified_ntimes: 1 }, last_notified_at: message.notification_timestamp });
    logger.info(`[NOTIFICATION SENT TO CUSTOMER.ID: ${customer_id}] @ ${message.notification_timestamp}`);


    // enqueue the next msg if required (if schedule not complete)
    const message_schedule     = get_message_schedule();
    const next_schedule_offset = checkout.notified_ntimes + 1;
    if(next_schedule_offset >= message_schedule.length) {
        logger.info(`[no new msg will be further scheduled for customer <${msg.customer_id}> <${msg.customer_email}> - reason: schedule complete`);
        return res.status(200).send({
            status: "success"
        });
    }

    // craft the next msg
    const prev_delay = job.data.delay;
    const next_delay = message_schedule[next_schedule_offset].delay;
    const msg        = {
        customer_id:         customer_id,
        customer_email:      customer_email,
        checkout_created_at: checkout_created_at,
        delay:               next_delay,
        msg:                 message_schedule[next_schedule_offset].msg
    };

    // enqueue it
    await enqueue_message(msg.customer_id, msg, next_delay);
}
