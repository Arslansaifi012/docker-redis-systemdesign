

import { redis } from "../index.js";

const ratelimitter = async (req, res, next) => {

    const ip  = req.ip
    console.log(ip, 'i am checking ip');
    
    const key = `rate_limit:${ip}`

    const request = await redis.incr(key);
    console.log(request, 'i am checking request');
    

    if (request == 1) {
        await redis.expire(key, 60)
    }
    
    if (request > 5) {
        return res.status(429).json({ message: 'TOO Many request' })
    };
    next();
    
};

export default ratelimitter;