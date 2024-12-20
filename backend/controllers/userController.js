import User from "../models/userModel.js";

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

            res.status(201).json({message:"succesfully follwed"})
        }


    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Internal server error"});
    }
}