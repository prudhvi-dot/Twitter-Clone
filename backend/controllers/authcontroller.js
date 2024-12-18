import User from "../models/userModel.js"
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";


export const signup = async(req, res)=>{

    try{
       const{fullName, email, password, userName} = req.body;

       // ========================================== INPUT VALIDATION ============================================

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       
       if (!emailRegex.test(email)){
        return res.status(400).json({error: "Invalid email format"});
       }
       const existingUser = await User.findOne({userName});
       if(existingUser) {
        return res.status(400).json({error: "username is already taken"});
       }

       const existingemail = await User.findOne({email});
       if(existingemail) {
        return res.status(400).json({error: "email is already taken"});
       }

       if(password.length<6) {
        return res.status(400).json({error: "Password must be greater than 6"})
       }


       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);

       const newUser = await User.create({userName,fullName,email,password:hashedPassword});

       if(newUser) {
        generateTokenAndSetCookie(newUser._id,res);
        res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            fullName: newUser.fullName,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg
        })
       }else{
        res.status(400).json({error: "Inivalid user data"});
       }

    } catch(err) {
        res.status(500).json({error: err.message});
    }
    
}
export const login = async(req, res)=>{
    
    try {

        const{userName, password} = req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect) {
           return res.status(400).json({error: "Invalid usename or password"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg})

    } catch(err) {
       return res.status(500).json({error: err.message});
    }

}
export const logout = async(req, res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
    } catch(err) {
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMe = async (req,res)=>{
    try {
        // const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(req.user);
    }
    catch(err) {
        res.status(500).json({error: "Internal server error"});
    }
}