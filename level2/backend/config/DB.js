

import mongoose from "mongoose";
console.log(process.env.MONGO_URI);



const DBconnection = () => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URI);
        console.log("DB connected successfully");
        
    } catch (error) {
        console.log("DB Connection error", error.message);
        
    }
};


export default DBconnection;