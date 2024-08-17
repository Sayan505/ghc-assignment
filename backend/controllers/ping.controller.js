async function ping_controller(req, res) {
    return res.status(200).send("Pong");
}


export default ping_controller;
