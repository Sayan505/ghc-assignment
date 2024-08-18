import redis_config      from "./redis.config.js";
import send_messages     from "../tasks/send_messages.task.js";

import logger            from "../utils/logger.util.js";

import { Queue, Worker } from "bullmq";


const bmq_queue_name = process.env.BULLMQ_QUEUE_NAME || "msg_q";


function start_bmq_worker() {
    const bmq_worker = new Worker(bmq_queue_name, async job => {
        send_messages(job);
    }, { connection: redis_config });

    logger.info("[started BullMQ worker]")

    return bmq_worker;
}

const bmq_queue  = new Queue(bmq_queue_name, { connection: redis_config, defaultJobOptions: { removeOnComplete: true } });


export { bmq_queue, start_bmq_worker };
