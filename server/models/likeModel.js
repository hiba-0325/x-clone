import mongoose from "mongoose";

const { Schema } = mongoose;

const likeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
});

const Like = mongoose.model("Like", likeSchema);

export default Like;
