import logger from "./logger.util.js";


export default function graceful_shutdown(server, bmq_worker_instance, dbconfig) {
    logger.info(`[=== server shutting down ===]`);
                
    // stop accepting new reqs
    server.close(() => {
        logger.info("[server stopped accepting new requests]");

        bmq_worker_instance.stop();
        logger.info("[stopped bullmq worker]");

        // then disconnect db
        dbconfig.disconnect_db().then(() => {
            logger.info("[=== server closed ===]");
            
            // then exit the node process
            //process.exit();
        });
    });
}
