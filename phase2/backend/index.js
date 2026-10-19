import express from "express";

const app = express();
import env from "dotenv";
env.config();

const PORT = process.env.PORT || 3000;
console.log(PORT,'i am checking PORT');

app.get("/", (req, res) => {
  res.status(200).json("hello I am docker 2 file side");
});

app.listen(PORT, () => console.log(`server is running ${PORT} PORT`));
