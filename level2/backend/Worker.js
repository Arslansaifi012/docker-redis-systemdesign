
import { Worker } from "bullmq"; 
import Redis from "ioredis";
import sendemail from "./config/email.js";

const connection = new Redis("redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const worker = new Worker("email-queue", async (job) => {
    console.log(job.data.email, "i am checking jon in side ");

    console.log("task started");
    const email = job.data.email;
    await sendemail(email);
    console.log("task completed");
  },
  { connection },
);