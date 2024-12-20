import express from "express";
import { getUserProfile, followAndUnfollow } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protected.js";

const router = express.Router();

router.get('/profile/:userName',getUserProfile);

// router.get('/suggested',(req,res)=>{

// })

router.post('/profile/:id',protectRoute,followAndUnfollow);



export default router;