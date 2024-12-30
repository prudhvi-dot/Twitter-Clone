import express from "express";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";


dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})



const app = express();
const port = process.env.PORT || 8000
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Home");
})

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/posts', postRoutes)


app.listen(port,()=>{
    console.log("listening......");
    connectDb();
});