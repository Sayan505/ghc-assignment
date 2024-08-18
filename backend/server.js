import express from "express";
import cors    from "cors";

import logger  from "./utils/logger.util.js";

import graceful_shutdown    from "./utils/graceful_shutdown.util.js"

import dbconfig             from "./config/mongoose.config.js";
import { start_bmq_worker } from "./config/bullmq.config.js";

// import routes
import webhooks_route from "./routes/webhooks.route.js";
import messages_route from "./routes/messages.route.js";
import orders_route   from "./routes/orders.route.js";


const app      = express();
const SRV_PORT = parseInt(process.env.BACKEND_PORT) || 3000;

app.use(cors());
app.use(express.json());


// register routes
app.use("/webhook",      webhooks_route);
app.use("/api/messages", messages_route);
app.use("/api/orders",   orders_route);


// connect to db
dbconfig.connect_db().then(() => {
    // start server
    const server = app.listen(SRV_PORT, () => {
        logger.info(`[server listening @ port ${SRV_PORT}]`);
    });

    // start BullMQ worker
    const bmq_worker_instance = start_bmq_worker();

    // rig graceful shutdown
    for(let sig of ["SIGINT", "SIGTERM"]) {
        process.on(sig, () => {
            graceful_shutdown(server, bmq_worker_instance, dbconfig);
        });
    }
});
