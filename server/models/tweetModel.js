import mongoose from "mongoose";

const { Schema } = mongoose;

const TweetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    media: [{ type: String }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reposts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    saved: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

    repostedTweetId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      default: null,
    },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", TweetSchema);

export default Tweet;
