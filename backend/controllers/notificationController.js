import Notification from "../models/notificationModel.js";

export const getNotifications = async(req, res)=>{

    try{
        const userId = req.user._id;
        const notifications = await Notification.find({to: userId}).populate({
            path: "from",
            select: "userName profileImg"
        })

        await Notification.updateMany({to: userId},{read: true});

        res.status(200).json(notifications);
    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}

export const deleteNotifications = async(req, res)=>{
    
    try{
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});

        res.status(200).json({error: "Notifications deleted successfully"});
    }
    catch(err){
        res.status(500).json({error: "Internal server error"});
    }
}