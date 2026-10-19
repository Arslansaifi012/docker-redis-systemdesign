import express, { json } from "express";

import Redis from "ioredis";

const app = express();

const redis = new Redis();

import env from "dotenv"
import DBconnection from "./config/DB.js";
import user from "./model/user.js";
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
  console.log(userdetails,'this is userdetails');
  

  res.json({ message: "user created sucessfully",  user:userdetails});

  
});

app.get('/user-get', async (req, res) => {

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


app.post('/send-otp', async() => {

  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp: ${email}`, otp);

  
})

app.listen(PORT, () => {
    DBconnection()
    console.log(`server is running ${PORT} PORT`)
});

