import mongoose from "mongoose";

import logger   from "../utils/logger.util.js";


function connect_db() {
    logger.info("[trying to connect to db ...]");

    return mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongodb:27017`, { dbName: process.env.MONGO_DB_NAME }).then(
        ()  => {
            logger.info(`[connected to db: \"${process.env.MONGO_DB_NAME}\"]`);
        },
        err => { logger.error(`[DB ERROR: ${err}]`); }
    );
}


function disconnect_db() {
    logger.info("[db disconnecting ...]");

    return mongoose.connection.close().then(
        ()  => {
            logger.info("[db disconnected]");
        },
        err => { logger.error(`[DB ERROR: ${err}]`); }
    );
}


export default { connect_db, disconnect_db };
export const mongoose_instance = mongoose;
