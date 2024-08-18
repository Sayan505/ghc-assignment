import Orders from "../models/orders.model.js";


async function orders_controller(req, res) {
    const requested_page     = parseInt(req.query.page) || 1;
    const max_items_per_page = 10;


    const npages = Math.ceil((await Orders.countDocuments()) / max_items_per_page);

    if(npages == 0) {
        return res.status(200).send({
            curr_page:          1,
            total_pages:        0,
            max_items_per_page: max_items_per_page,
            data: []
        });
    }

    if(requested_page > npages || requested_page < 1) {
        return res.status(400).send({
            status:      "page does not exist",
            total_pages: npages,
            data:        []
        });
    }


    const skip   = (requested_page - 1) * max_items_per_page;
    const orders = await Orders.find({}).skip(skip).limit(max_items_per_page);

    return res.status(200).send({
        curr_page:          requested_page,
        total_pages:        npages,
        max_items_per_page: max_items_per_page,
        data: orders
    });
}


export default orders_controller;
