import {v2 as cloudinary} from "cloudinary";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import bcrypt from "bcrypt";

export const getUserProfile = async(req,res)=>{
    const{userName} = req.params;

    console.log(req.params);

    try{

        const user = await User.findOne({userName}).select('-password');

        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json(user);

    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }

}

export const followAndUnfollow = async(req,res)=>{
    try{

        const {id} = req.params;
        const userToModify = await User.findById(id);


        const currentUser = await User.findById(req.user._id);



        if(id === req.user._id.toString()) {
            return res.status(400).json({error: "You cant follow/unfollow yourself"});
        }

        if(!userToModify || !currentUser) {
            res.status(400).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if(isFollowing) {

            await User.findByIdAndUpdate(id, {$pull:{followers: req.user._id}});
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}});

            res.status(201).json({message:"succesfully Unfollwed"})

        }
        else{

            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})

            await User.findByIdAndUpdate(req.user._id,{$push:{following: id}})

            const notification = await Notification.create({
                from: req.user._id,
                to: id,
                type: 'follow',   
            })

            res.status(201).json({message:"succesfully follwed"})
        }


    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

export const getSuggestedUsers = async(req,res)=>{
    try {

        const userId = req.user._id;

        const {following} = await User.findById(userId).select('following');


        const suggestedUsers = await User.aggregate([
            {$match:{_id:{$ne:userId,$nin:following}}},
            {$sample:{size:10}},
            {$project:{password:0}},    
        ]);

        const limitedSuggestedUsers = suggestedUsers.slice(0, 4);

        return res.status(200).json(limitedSuggestedUsers);

    }
    catch(err) {
        console.log(err)
        res.status(500).json({error: "Internal server error"});
    }
}


export const updateUser = async (req,res) =>{
    const{fullName, email, userName, currentPassword, newPassword, bio, link} = req.body;
    let{profileImg, coverImg} = req.body;

    let user = await User.findById(req.user._id);

    try{

        if(!user) {
            return res.status(400).json({error: "User not found"});
        }

        if((!currentPassword && newPassword)||(!newPassword && currentPassword)){
            return res.status(400).json({error:"Please provide current and new passwords"});

        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if(!isMatch){
                return res.status(400).json({error: "Incorrect current password"});
            }

            if(newPassword.length<6) {
                res.status(400).json({error: "Password length must be atleast 6"});
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword,salt);

            user.password = hashedPassword;
        }

            if(profileImg){

                if(user.profileImg){
                    await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);
                }

              const uploadedImg = await cloudinary.uploader.upload(profileImg);
              profileImg = uploadedImg.secure_url;
            }

            if(coverImg){

                if(user.coverImg){
                    await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);
                }
              const uploadedImg = await cloudinary.uploader.upload(coverImg);
              coverImg = uploadedImg.secure_url;
            }

            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.userName = userName || user.userName;
            user.bio = bio || user.bio;
            user.profileImg = profileImg || user.profileImg;
            user.coverImg = coverImg || user.coverImg;

            user = await user.save();

            user.password = null;

            return res.status(200).json(user);


    }
    catch(err){

        console.log(err);

        return res.status(500).json({error: "Internal server error"});

    }
}


// const userId = req.user._id;
// const Doc = await User.findById(userId).select('following');
// const followingArray = Doc.following

