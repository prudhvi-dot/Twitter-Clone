import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/notificationModel.js"
import {v2 as cloudinary} from "cloudinary";

export const createPost = async (req, res)=>{
    try{
        const{text} = req.body;
        let{img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);

        if(!user){
           return res.status(400).json({error: "User not found"});
        }

        if(!text && !img) {
          return  res.status(400).json({error: "Post must have a text or image"});
        }

        if(img){
            const uploadedImg = await cloudinary.uploader.upload(img);
            img = uploadedImg.secure_url;
        }

        const newPost = await Post.create({
            user: userId,
            text,
            img
        })


        res.status(201).json(newPost);
    }
    catch(err){
        res.status(500).json({error: "Internal server Error"});
    }
}

export const deletePost = async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({error: "Post is not available"});
        }

        if(post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: "You are not authorized to delete this post"});
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted succesfully"});
    }
    catch(err){

        console.log(err);
        res.status(500).json({error: "Internal server error"});
    }
}

export const commentOnPost = async(req,res)=>{
    try{

        const postId = req.params.id;
        const{text} = req.body;
        const userId = req.user._id;

        if(!text) {
            return res.status(400).json({error: "Text field is required"});
        }

        const post = await Post.findById(postId);

        if(!post) {
            res.status(404).json({error: "Post is Unavailable"});
        }

        const comment = {user: userId, text}

        post.comments.push(comment);

        await post.save();

        res.status(200).json(post);
        
    }
    catch(err) {
        res.status(500).json({error: "Internal server error"});
    }
}

export const likePost = async (req, res)=>{
    try{
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error: "post not found"});
        }

        if(post.likes.includes(userId)){
            await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}})
            await User.findByIdAndUpdate(userId,{$pull:{likedPosts: postId}})
            res.status(200).json({message: "sucesfully Unliked/"});
        }
        else{
            await Post.findByIdAndUpdate(postId,{$push:{likes:userId}})
            await User.findByIdAndUpdate(userId,{$push:{likedPosts:postId}})
            const newNotification = await Notification.create({
                from: userId,
                to:post.user,
                type: 'like'
            })

            res.status(200).json({message: "Post liked succesfully"});

        }

    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

export const getAllPosts = async (req, res)=>{
    try{

        const posts = await Post.find().select('-password').sort({createdAt: -1}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: "comments.user",
            select: '-password'
        })

        if(posts.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(posts);

    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}


export const getLikedPosts = async(req, res)=>{
    const userId = req.params.id;

    try{
        const user = await User.findById(userId);

        if(!user) return res.status(404).json({error: "User not found"});

        const likedPosts = await Post.find({_id:{$in: user.likedPosts}}).populate({
            path: 'user',
            select: '-password'
        }).populate({
            path: 'comments.user',
            select: '-password'
        });

        res.status(200).json(likedPosts);

    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

export const followingPosts = async(req,res)=>{

    try {
    const userId = req.user._id;
    const {following} = await User.findById(userId).select('following');

    const posts = Post.find({user:{$in:following}}).sort({createdAt: -1}).populate({
        path: 'user',
        select: '-password'
    }).populate({
        path: 'comments.user',
        select: '-password'
    })
    res.status(200).json(posts);
    }
    catch(err) {
        res.status(500).json({erro: "Internal server error"});
    } 
}

export const getUserPosts = async(req, res)=>{
    try{
        const{userName} = req.params;
        const user = await User.find({userName});

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: 'user',
            select: "-password"
        }).populate({
            path: 'comments.user',
            select: '-password'
        })

        res.status(200).json(posts);

    }
    catch(err) {
        res.status(500).json({error: "Internal server error"})
    }
}