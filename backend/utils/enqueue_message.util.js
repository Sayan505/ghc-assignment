import { bmq_queue } from "../config/bullmq.config.js";
import logger        from "./logger.util.js";


async function enqueue_message(key, msg, delay) {
    const bmq_job_id = `id-${key}`;

    // clear prev. msgs (if exists) to start afresh
    const job = await bmq_queue.getJob(bmq_job_id);
    if(job) {
        await job.remove();
        logger.info(`[removed previously enqueued msg customer.id: ${msg.customer_id}]`);
    }

    // enqueue the msg
    await bmq_queue.add(key, msg, { delay: delay, jobId: bmq_job_id }).then(() => {
        logger.info(`[enqueued new msg for customer <${msg.customer_id}> <${msg.customer_email}> - delay ${delay/1000/60/60} hrs`);
    });
}


export default enqueue_message;
