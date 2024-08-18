import enqueue_message  from "../utils/enqueue_message.util.js";
import logger           from "../utils/logger.util.js";

import message_schedule from "../config/message_schedule.config.js";

import Checkout         from "../models/checkouts.model.js";


async function checkout_abandoned_webhook_controller(req, res) {
    const checkout_id          = req.body.id;
    const customer_id          = req.body.customer.id;
    const customer_email       = req.body.customer.email;
    const checkout_created_at  = req.body.created_at;

    logger.info(`[checkout_abandoned webhook triggered for customer.id ${customer_id} <${customer_email}>]`);


    var checkout = new Checkout({
        checkout_id:         checkout_id,
        customer_id:         customer_id,
        customer_email:      customer_email,
        checkout_created_at: checkout_created_at
    }).toObject();
    delete checkout._id;

    await Checkout.replaceOne({ customer_id: customer_id }, checkout, { upsert: true });


    const delay    = message_schedule[0].delay;
    const msg      = {
        customer_id:         customer_id,
        customer_email:      customer_email,
        checkout_created_at: checkout_created_at,
        delay:               delay,
        msg:                 message_schedule[0].msg
    };


    // enqueue the first msg to be sent
    await enqueue_message(msg.customer_id, msg, delay);

    // later, when sending the msg, we check if the user has placed the order or not
    // if not then send the msg and enqueue the next in the schedule and repeat,
    // else, don't enqueue further msgs to be sent


    return res.status(200).send({
        status: "success"
    });
}


export default checkout_abandoned_webhook_controller;
