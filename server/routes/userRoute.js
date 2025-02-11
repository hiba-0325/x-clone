import express from "express";
import tryCatch from "../utils/tryCatch.js";
import verifyToken from "../middlewares/auth.js";
import upload from "../config/multer.js";
import {
  updateProfile,
  updateUserPfp,
  removeUserPfp,
  updateUserHeader,
  removeUserHeader,
} from "../controllers/user/userDetailController.js";
import { uploadToCloudinary } from "../middlewares/uploadFile.js";
import {
  createTweet,
  getAllTweets,
  likeTweet,
  getLikedTweets,
  saveTweet,
  getSavedTweets,
  repostTweet,
  deleteTweet,
  commentOnTweet,
} from "../controllers/user/tweetController.js";



import {followUser, removeFollower, getFollowerList, getFollowingList, getFollowCount, getFollowStatus} from "../controllers/user/followController.js"



const router = express.Router();
router


  //profile

  .post(
    "/update/pfp",
    verifyToken,
    upload.single("file"),
    uploadToCloudinary,
    tryCatch(updateUserPfp)
  )
  .delete("/remove/pfp", verifyToken, tryCatch(removeUserPfp))

  .post(
    "/update/header",
    verifyToken,
    upload.single("file"),
    uploadToCloudinary,
    tryCatch(updateUserHeader)
  )
  .delete("/remove/header", verifyToken, tryCatch(removeUserHeader))

  .post("/update/profile", verifyToken, tryCatch(updateProfile))

  //tweet
  .get("/tweets", getAllTweets)
  .post(
    "/tweets/create",
    verifyToken,
    upload.single("file"),
    uploadToCloudinary,
    createTweet
  )
  .delete("/tweets/:id/delete", verifyToken, deleteTweet)
  .post("/tweets/:id/like", verifyToken, likeTweet)
  .get("/tweets/liked", verifyToken, getLikedTweets)
  .post("/tweets/:id/save", verifyToken, saveTweet)
  .get("/tweets/saved", verifyToken, getSavedTweets)
  .post("/tweets/:id/repost", verifyToken, repostTweet)
  .post("/tweets/:id/comment", verifyToken, commentOnTweet)

  //follow
  .post('/follow/:id', verifyToken,tryCatch(followUser))
  .delete('/remove/:id',verifyToken, tryCatch(removeFollower))
  .get('/followers/:id', verifyToken, tryCatch(getFollowerList))
.get('/following/:id',verifyToken, tryCatch(getFollowingList))
.get('/follow-count/:id', verifyToken, tryCatch(getFollowCount))
.get('/follow-status/:id', verifyToken, tryCatch(getFollowStatus))

export default router;
