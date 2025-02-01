import mongoose, { Types } from "mongoose";

const TweetSchema = new mongoose.Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String },
      media: [{ type: String }],
      likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
      repost: [{ type: Schema.Types.ObjectId, ref: "User" }],
      saved: [{ type: Schema.Types.ObjectId, ref: "User" }],
      comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },
    { timestamps: true }
  );

export const Tweet = mongoose.model("Tweet",TweetSchema);