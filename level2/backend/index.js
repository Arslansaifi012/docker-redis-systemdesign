import express from "express";

import Redis from "ioredis";


const app = express();

export const redis = new Redis();

import env from "dotenv"
import DBconnection from "./config/DB.js";
import user from "./model/user.js";
import ratelimitter from "./middleware/rateLimit.js";
import emailQueue from "./queue.js";
env.config();

app.use(express.json())
const PORT = process.env.PORT || 3000;

app.post("/create-user", async(req, res) => {

  const { name, email, password } = req.body;

  await redis.del('user')
  
  const userdetails = await user.create({
    name,
    email,
    password,
  });

  await emailQueue.add("email-queue", { email });
  
  res.json({ message: "user created sucessfully",  user:userdetails});

  
});

app.get('/user-get', ratelimitter, async (req, res) => {

  const { name, email, password } = req.body;

  console.log(name, email, password);

  const allUser = await user.find({});

  res.json({ message: 'all user get', allUser })
  
});


app.get('/user-get-redis', async (req, res) => {
  
  const datainRedis = await redis.get('user');
 
  if (datainRedis) {
    const data = JSON.parse(datainRedis)
    res.json({ message: 'all data', data });
    
  } else {

    const allUser = await user.find({});
    await redis.set("user", JSON.stringify(allUser));
    return res.json({ message: 'all user data', allUser })

  }
   
});


app.post('/send-otp', async (req, res) => {

  const { email } = req.body;
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, 'EX', 30)

  res.json({ message: 'otp send successfully', otp });
  
});

app.post('/verify-otp', async (req, res) => {

  const { email, otp } = req.body;
  
  const redisOtp = await redis.get(`otp:${email}`);

  if (otp === redisOtp) {
    return res.json({ message: 'otp verified successfully' })
  } else {
     return res.json({ message: "invalid otp or otp has been expired" });
  }
  
});

app.listen(PORT, () => {
    DBconnection()
    console.log(`server is running ${PORT} PORT`)
});

