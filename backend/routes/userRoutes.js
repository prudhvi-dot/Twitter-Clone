import express from "express";
import { getUserProfile, followAndUnfollow, getSuggestedUsers, updateUser } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protected.js";

const router = express.Router();

router.get('/profile/:userName',getUserProfile);

router.get('/suggested',protectRoute,getSuggestedUsers);

router.post('/follow/:id',protectRoute,followAndUnfollow);

router.post('/update',protectRoute ,updateUser);



export default router;