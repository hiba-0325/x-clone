import mongoose from "mongoose";

const { Schema } = mongoose;

const saveSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tweet: { type: Schema.Types.ObjectId, ref: "Tweet", required: true },
});

 const Saved = mongoose.model("Saved", saveSchema);
export default Saved