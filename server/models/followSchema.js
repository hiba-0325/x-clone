import mongoose from "mongoose";
const { Schema } = mongoose;

const followSchema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
  following: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
