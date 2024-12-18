import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;

        if(!token) {
            return res.status(401).json({error: "Unauthorized"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(401).json({error: "Token not valid"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({error: "Internal server error"})
    }
}