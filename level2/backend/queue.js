import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis("redis://localhost:6379", {
    maxRetriesPerrequest: null
});




const emailQueue = new Queue("email-queue", { connection });

export default emailQueue;