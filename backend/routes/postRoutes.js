import express from "express";
import { protectRoute } from "../middleware/protected.js";
import { createPost, deletePost, commentOnPost, likePost, getAllPosts, getLikedPosts, followingPosts, getUserPosts} from "../controllers/postController.js";

const router = express.Router();

router.post('/create',protectRoute,createPost);
router.delete('/:id',protectRoute,deletePost);
router.get('/following',protectRoute, followingPosts);
router.get('/user/:userName',protectRoute, getUserPosts);
router.post('/comment/:id', protectRoute,commentOnPost);
router.post('/like/:id', protectRoute, likePost);
router.get('/liked/:id',protectRoute, getLikedPosts);
router.get('/all',protectRoute, getAllPosts);


export default router;