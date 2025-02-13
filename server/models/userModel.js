import mongoose from "mongoose";
const {Schema}= mongoose
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pfp: {
      type: String,
      default:
        "https://i.pinimg.com/736x/20/05/e2/2005e27a39fa5f6d97b2e0a95233b2be.jpg",
    },
    bio: { type: String },

    header: {
      type: String,
      default:
        "https://i.pinimg.com/736x/3a/c8/c4/3ac8c49fd8ba87a6dc02cc80b5015b7b.jpg",
    },
    web: { type: String },
    location: { type: String },
    dob: { type: String, required: false },
    likedTweets: { type: [Schema.Types.ObjectId], ref: 'Tweet' },
    savedTweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
