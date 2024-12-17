import express from "express";
import authRoutes from "./routes/authroutes.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get('/',(req,res)=>{
    res.send("Home");
})

app.use('/api/auth',authRoutes);

const port = process.env.PORT || 8000
app.listen(port,()=>{
    console.log("listening......");
    connectDb();
});