import logger   from "../utils/logger.util.js";

import Order    from "../models/orders.model.js";
import Checkout from "../models/checkouts.model.js";


async function order_placed_webhook_controller(req, res) {
    const order_id         = req.body.order.id;
    const order_created_at = req.body.order.created_at;
    const customer_id      = req.body.order.customer.id;
    const customer_email   = req.body.order.customer.email;

    logger.info(`[order_placed webhook triggered for customer.id ${customer_id}]`);


    var order = new Order({
        order_id:         order_id,
        order_created_at: order_created_at,
        customer_id:      customer_id,
        customer_email:   customer_email
    });

    // if an order is placed, check if last_notified_at != undefined,
    // if true, then the order was placed through the notifications
    const checkout = await Checkout.findOneAndUpdate({ customer_id: customer_id }, { is_order_placed: true });
    if(checkout && checkout.last_notified_at) {
        order.last_notified_at            = checkout.last_notified_at;
        order.is_order_placed_after_notif = true;
        order.notified_ntimes             = checkout.notified_ntimes;
    }

    await order.save();


    return res.status(200).send({
        status: "success"
    });
}


export default order_placed_webhook_controller;
