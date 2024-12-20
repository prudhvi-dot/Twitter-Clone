import express from "express";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const port = process.env.PORT || 8000
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Home");
})

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);


app.listen(port,()=>{
    console.log("listening......");
    connectDb();
});