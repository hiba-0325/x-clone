import User from "../../models/userModel.js";
import Notification from "../../models/notificationModel.js";
import Follow  from "../../models/followSchema.js";
import CustomError from "../../utils/customError.js";
import { io, userSocketMap } from "../../socket.js";
const followUser = async (req, res, next) => {
    const followingId = req.params.id; // Fixed this line
    const follower = await User.findById(req.user.id);
    const following = await User.findById(followingId);

    if (!follower || !following) {
        return next(new CustomError("User not found", 404));
    }

    const follow = await Follow.findOne({ follower: req.user.id, following: followingId });
    if (follow) {
        await follow.deleteOne();
        return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
        const newFollow = new Follow({ follower: req.user.id, following: followingId });
        await newFollow.save();

        const notification = await Notification.create({
            acceptor: followingId,
            sender: req.user.id,
            type: "follow",
        });

        if (userSocketMap[followingId]) {
            io.to(userSocketMap[followingId]).emit("newNotification", {
                notification: notification._doc,
                sender: {
                    username: follower.userName,
                    profile: follower.pfp,
                    name: follower.name,
                },
            });
        }

        return res.status(200).json({ message: "Followed successfully" });
    }
};
const removeFollower = async (req, res, next) => {
    const follower = await User.findById(req.params.id);
    const following = await User.findById(req.user.id);

    if (!follower || !following) {
        return next(new CustomError("User not found", 404));
    }


    const followRecord = await Follow.findOne({ follower: req.params.id, following: req.user.id });

    if (!followRecord) {
        return res.status(400).json({ message: "User does not follow you" });
    }

    await followRecord.deleteOne();

    res.status(200).json({ message: "Follower removed successfully" });
};


const getFollowerList = async (req, res, next) => {
    const followers = await Follow.find({ following: req.params.id }).populate("follower", "userName pfp ");//add name
    if(followers.length===0){
        return res.status(200).json({ followers: [], message: "No followers found" });
    }
    res.status(200).json({ followers });
};

const getFollowingList = async (req, res, next) => {
    const following = await Follow.find({ follower: req.params.id }).populate("following", "userName pfp ");
    if(following.length===0){
        return res.status(200).json({ following: [], message: "No following found" });
    }
    res.status(200).json({ following });
};

const getFollowCount = async (req, res, next) => {
    const followerCount = await Follow.countDocuments({ following: req.params.id });
    const followingCount = await Follow.countDocuments({ follower: req.params.id });
    res.status(200).json({ followerCount, followingCount });
};
const getFollowStatus = async (req, res, next) => {
    const follow = await Follow.findOne({ follower: req.user.id, following: req.params.id });
    if (follow) {
        res.status(200).json({ isFollowing: true });
    } else {
        res.status(200).json({ isFollowing: false });
    }
};

export { followUser, removeFollower, getFollowerList, getFollowingList, getFollowCount, getFollowStatus };