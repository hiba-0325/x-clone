import Tweet from "../../models/tweetModel.js";
import User from "../../models/userModel.js";
import Comment from "../../models/commentModel.js";
import Saved from "../../models/savedModel.js";
import CustomError from "../../utils/customError.js";
import { userSocketMap } from "../../socket.js";
import Notification from "../../models/notificationModel.js";
import Follow from "../../models/followSchema.js";

const createTweet = async (req, res, next) => {
  try {
    const { text } = req.body; 
    console.log("this is req body:", req.body);

    const userId = req.user.id;
    let media = [];

    if (req.file) {
      const uploadedFile = req.uploadedFile;
      media.push(uploadedFile.secure_url);
    }

    if (!text && media.length === 0) {
      return next(new CustomError("Tweet must contain either text or media", 400));
    }

    const newTweet = new Tweet({ user: userId, text, media });
    await newTweet.save();

    await User.findByIdAndUpdate(userId, { $push: { tweets: newTweet._id } });

    res.status(201).json({ message: "Tweet created successfully", tweet: newTweet });
  } catch (error) {
    console.log(error);
    next(new CustomError("Error creating tweet", 500));
  }
};

//delete tweet

const deleteTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;


    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return next(new CustomError("Tweet not found", 404));
    }

    if (tweet.user.toString() !== userId) {
      return next(new CustomError("You can only delete your own tweets", 403));
    }

    await Tweet.findByIdAndDelete(tweetId);

    res.status(200).json({ message: "Tweet deleted successfully" });
  } catch (error) {
    next(new CustomError("Error deleting tweet", 500));
  }
};


// Get all tweets
const getAllTweets = async (req, res, next) => {
  try {
    console.log("Fetching tweets...");

    const tweets = await Tweet.find().populate("user", "userName pfp");
    
   

    res.status(200).json({ tweets });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    next(new CustomError("Error retrieving tweets", 500));
  }
};

// Like a tweet
const likeTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const isLiked = tweet.likes.includes(userId);

    if (isLiked) {
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedTweets: tweetId } });
      return res.status(200).json({ message: "Tweet unliked successfully" });
    }

    await Tweet.findByIdAndUpdate(tweetId, { $push: { likes: userId } });
    await User.findByIdAndUpdate(userId, { $push: { likedTweets: tweetId } });

    if (tweet.user.toString() !== userId) {
      const notification = new Notification({
        acceptor: tweet.user,
        sender: userId,
        type: "like",
      });

      await notification.save();

      if (userSocketMap[tweet.user]) {
        io.to(userSocketMap[tweet.user]).emit("newNotification", notification);
      }
    }

    res.status(200).json({ message: "Tweet liked successfully" });
  } catch (error) {
    console.error("Error in likeTweet:", error);
    next(new CustomError("Error liking tweet", 500));
  }
};

//getLikedTweets
const getLikedTweets = async (req, res, next) => {
  try {
    const userId = req.user.id;

    
    const user = await User.findById(userId).populate({
      path: "likedTweets",
      populate: { path: "user", select: "userName pfp" }, 
    });

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    if (!user.likedTweets.length) {
      return res.status(404).json({ message: "No liked tweets found" });
    }

    res.status(200).json({ likedTweets: user.likedTweets });
  } catch (error) {
    console.error("Error fetching liked tweets:", error);
    next(new CustomError("Error fetching liked tweets", 500));
  }
};

// Save a tweet
const saveTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;

    console.log('Tweet ID:', tweetId);
    console.log('User ID:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    const tweet = await Tweet.findById(tweetId);  
    if (!tweet) {
      console.log("No tweet found with the provided tweetId:", tweetId);
      return next(new CustomError("Tweet not found", 404));
    }
    
    console.log('Tweet found:', tweet);

    const isTweetSaved = tweet.saved.includes(userId);

    if (isTweetSaved) {
      tweet.saved.pull(userId);
      await tweet.save();
      await User.findByIdAndUpdate(userId, { $pull: { savedTweets: tweetId } });
      return res.status(200).json({ message: "Tweet removed from bookmarks" });
    }

    tweet.saved.push(userId);
    await tweet.save();
    await User.findByIdAndUpdate(userId, { $push: { savedTweets: tweetId } });

    const notification = new Notification({
      acceptor: tweet.user,
      sender: userId,
      type: "save",
    });

    console.log('Notification:', notification);

    await notification.save();

    if (userSocketMap[tweet.user]) {
      io.to(userSocketMap[tweet.user]).emit("newNotification", notification);
    }

    res.status(200).json({ message: "Tweet saved to bookmarks" });
  } catch (error) {
    console.error("Error in saving tweet:", error);
    next(new CustomError("Error saving tweet", 500));
  }
};

//getSavedtweet

const getSavedTweets = async (req, res, next) => {
  try {
    const userId = req.user.id;

   
    const tweets = await Tweet.find({ saved: { $in: [userId] } })
      .populate("user", "username profilePicture")
      .populate("comments");

    if (!tweets.length) {
      return res.status(404).json({ message: "No saved tweets found" });
    }

    res.status(200).json({ message: "Saved tweets retrieved successfully", tweets });
  } catch (error) {
    console.error("Error fetching saved tweets:", error);
    next(new CustomError("Error fetching saved tweets", 500));
  }
};


// Repost a tweet
const repostTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;

    const existingRepost = await Tweet.findOne({ user: userId, repostedTweetId: tweetId });
    if (existingRepost) {
      await existingRepost.deleteOne();
      await Tweet.findByIdAndUpdate(tweetId, { $pull: { reposts: userId } });
      return res.status(200).json({ message: "Tweet un-reposted" });
    }

    const originalTweet = await Tweet.findById(tweetId);
    if (!originalTweet) {
      return next(new CustomError("Original tweet not found", 404));
    }

    const repostedTweet = new Tweet({
      user: userId,
      text: originalTweet.text,
      media: originalTweet.media,
      repostedTweetId: originalTweet._id,
    });

    await repostedTweet.save();

    await Tweet.findByIdAndUpdate(tweetId, { $push: { reposts: userId } });

    res.status(201).json({
      message: "Tweet reposted successfully",
      repostedTweet,
      repostCount: originalTweet.reposts.length + 1,
    });
  } catch (error) {
    console.error(error);
    next(new CustomError("Error reposting tweet", 500));
  }
};

// Comment on a tweet
// Comment on a tweet
const commentOnTweet = async (req, res, next) => {
  try {
    const tweetId = req.params.id;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return next(new CustomError("Comment content is required", 400));
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return next(new CustomError("Tweet not found", 404));
    }

    const newComment = new Comment({
      user: userId,
      tweet: tweetId,
      content,
    });

    await newComment.save();

    await Tweet.findByIdAndUpdate(tweetId, {
      $push: {
        comments: newComment._id,
      },
    });

    if (tweet.user.toString() !== userId) {
      const notification = new Notification({
        acceptor: tweet.user,
        sender: userId,
        type: "comment",
      });

      await notification.save();

      if (userSocketMap[tweet.user]) {
        io.to(userSocketMap[tweet.user]).emit("newNotification", notification);
      }
    }

    res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error commenting on tweet:", error);
    next(new CustomError("Error commenting on tweet", 500));
  }
};


const fetchUserComments = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const comments = await Comment.find({ user: userId })
      .populate("user", "userName pfp") 
      .populate({
        path: "tweet",
        populate: {
          path: "user",
          select: "userName pfp", 
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    next(new CustomError("Error retrieving user comments", 500));
  }
};



const fetchFollowingUserPost = async (req, res, next) => {
  try {
    const userId = req.user.id;

   
    const followingUsers = await Follow.find({ follower: userId }).select("following");

    if (!followingUsers.length) {
      return res.status(200).json({ tweets: [] });
    }

 
    const followingUserIds = followingUsers.map((follow) => follow.following);


    const tweets = await Tweet.find({ user: { $in: followingUserIds } })
      .populate("user", "userName pfp")
      .sort({ createdAt: -1 });

    res.status(200).json({ tweets });
  } catch (error) {
    console.error("Error fetching following users' tweets:", error);
    next(new CustomError("Error retrieving tweets", 500));
  }
};


const fetchUserTweets = async (req, res, next) => {
  try {
    const { userId } = req.params;

    console.log("Fetching tweets for userId:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const tweets = await Tweet.find({ userId }).sort({ createdAt: -1 });

    console.log("Fetched tweets:", tweets);

    if (!tweets.length) {
      return res.status(404).json({ message: "No tweets found for this user" });
    }

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching user tweets:", error);
    next(new CustomError("Error retrieving user tweets", 500));
  }
};

export {
  createTweet,
  deleteTweet,
  getAllTweets,
  likeTweet,
  getLikedTweets,
  saveTweet,
  getSavedTweets,
  repostTweet,
  commentOnTweet,
  fetchUserComments,
  fetchUserTweets,
  fetchFollowingUserPost
};
