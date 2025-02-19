import User from "../../models/userModel.js";
import CustomError from "../../utils/customError.js";
import Tweet from "../../models/tweetModel.js";
import Comment from "../../models/commentModel.js";




const getOneUser = async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    const totalPosts = await Post.find({
      username: req.params.username,
    }).countDocuments();
    const userDetail = {
      _id: user._id,
      fullname: user.name,
      username: user.userName,
      profile: user.pfp,
      bio: user.bio,
      email: user.email,
      totalPosts: totalPosts,
    };
    res.status(200).json({ user: userDetail });
  };

  
const getUsersByUsername = async (req, res, next) => {
  const users = await User.find(
    {
      $or: [
        { username: { $regex: req.params.userName, $options: "i" } },
        { fullname: { $regex: req.params.userName, $options: "i" } },
      ],
    },
    { username: 1, fullname: 1, profile: 1 }
  );
  if (users.length === 0) {
    return res.status(200).json({ users: [], message: "No user found" });
  }
  res.status(200).json(users);
};


const userProfilePic = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.userName });
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  res
    .status(200)
    .json({
      profile: user.pfp,
      username: user.userName,
      fullname: user.name,
      _id: user._id,
    });
};

const suggestedUsers = async (req, res, next) => {
  const followings = await Follow.find({ follower: req.user.id }).select(
    "following"
  );
  if (followings.length === 0) {
    const usersWithMostFollowers = await Follow.aggregate([
      { $group: { _id: "$following", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 1 } },
    ]);
    const users = await User.find({
      _id: { $in: usersWithMostFollowers.map((f) => f._id) },
    })
      .select("username fullname profile")
      .limit(5);
    return res.status(200).json({ suggestedUsers: users });
  }

  const followingIds = followings.map((f) => f.following.toString());

  const followingsFollowings = await Follow.find({
    follower: { $in: followingIds },
  }).select("following");

  if (followingsFollowings.length === 0) {
    return res.status(200).json({ suggestedUsers: [] });
  }

  const suggestedUserIds = followingsFollowings.map((f) =>
    f.following.toString()
  );

  const excludedUsers = [...followingIds, req.user.id.toString()];
  const uniqueSuggestedUserIds = [...new Set(suggestedUserIds)].filter(
    (userId) => !excludedUsers.includes(userId)

    
  );

  
  const suggestedUsers = await User.find({
    _id: { $in: uniqueSuggestedUserIds },
  })
    .select("username fullname profile")
    .limit(5);

  res.status(200).json({ suggestedUsers });
};


const getCommentedPosts = async (req, res, next) => {
  const commentedPosts = await Comment.find({ user: req.user.id }).populate(
    "Tweet"
  );
  if (commentedPosts.length === 0) {
    return res
      .status(200)
      .json({ posts: [], message: "No commented posts found" });
  }
  res.status(200).json({ posts: commentedPosts });
};

export { getOneUser, getUsersByUsername, userProfilePic, suggestedUsers, getCommentedPosts };