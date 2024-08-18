import logger           from "../utils/logger.util.js";

import enqueue_message  from "../utils/enqueue_message.util.js";

import { get_message_schedule } from "../config/message_schedule.config.js";

import Checkout         from "../models/checkouts.model.js";
import Message          from "../models/messages.model.js";


// when sending the msg, we check if the user has placed the order or not
// if not then send the msg and enqueue the next in the schedule and repeat,
// else, don't enqueue further msgs to be sent
export default async function send_message(job) {
    const customer_id             = job.data.customer_id;
    const customer_email          = job.data.customer_email;
    const checkout_created_at     = job.data.checkout_created_at;
    const msg_string              = job.data.msg;
    const current_schedule_offset = job.data.schedule_offset;


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
    logger.info(`[NOTIFICATION SENT TO CUSTOMER.ID: ${customer_id}] @ ${message.notification_timestamp} - ${msg_string}`);


    // enqueue the next msg if required (if schedule not complete)
    const message_schedule     = get_message_schedule();
    var next_schedule_offset = current_schedule_offset + 1;
    if(next_schedule_offset >= message_schedule.length) {
        logger.info(`[no new msg will be further scheduled for customer <${customer_id}> <${customer_email}> - reason: schedule complete`);
        return;
    }


    // calc next delay
    const prev_delay = job.data.delay;
    var next_delay   = message_schedule[next_schedule_offset].delay - prev_delay;
    // if the next_delay is negative or zero (can happen on schedule change or bad schedule)
    if(next_delay <= 0) {
        var higher_delay_found = false;
    
        // find next sched offset with higher delay
        for(let i = next_schedule_offset; i < message_schedule.length; ++i) {
            if(message_schedule[i].delay > message_schedule[next_schedule_offset].delay) {
                next_schedule_offset = i;
                next_delay           = message_schedule[next_schedule_offset].delay - prev_delay;

                higher_delay_found   = true;
                break;
            }
        }

        // else, call it schedule complete, return
        if(!higher_delay_found) {
            logger.info(`[no new msg will be further scheduled for customer <${customer_id}> <${customer_email}> - reason: next higher delay doesn't exist - schedule complete`);
            return;
        }
    }


    // then craft the next msg (after calculating next delay)
    const next_msg   = {
        customer_id:         customer_id,
        customer_email:      customer_email,
        checkout_created_at: checkout_created_at,
        delay:               message_schedule[next_schedule_offset].delay,
        schedule_offset:     next_schedule_offset,
        msg:                 message_schedule[next_schedule_offset].msg
    };


    // enqueue it
    await enqueue_message(next_msg.customer_id, next_msg, next_delay);
}
