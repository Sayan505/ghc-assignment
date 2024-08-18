import Messages from "../models/messages.model.js";


async function messages_controller(req, res) {
    const requested_page     = parseInt(req.query.page) || 1;
    const max_items_per_page = 10;


    const npages = Math.ceil((await Messages.countDocuments()) / max_items_per_page);
    if(requested_page > npages || requested_page < 1) {
        return res.status(400).send({
            status:      "page does not exist",
            total_pages: npages,
            data:        []
        });
    }

    const skip     = (requested_page - 1) * max_items_per_page;
    const messages = await Messages.find({}).skip(skip).limit(max_items_per_page);

    return res.status(200).send({
        curr_page:          requested_page,
        total_pages:        npages,
        max_items_per_page: max_items_per_page,
        data: messages
    });
}


export default messages_controller;
