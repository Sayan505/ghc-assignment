import express from "express";
import cors    from "cors";

import logger  from "./utils/logger.util.js";

// import routes
import ping_route from "./routes/ping.route.js";


const app      = express();
const SRV_PORT = parseInt(process.env.SRV_PORT) || 3000;

app.use(cors());


// register routes
app.use("/api/ping", ping_route);

const server = app.listen(SRV_PORT, () => {
    logger.info(`[server listening @ port ${SRV_PORT}]`);
});
