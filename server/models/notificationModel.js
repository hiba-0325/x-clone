import mongoose from "mongoose";

const {Schema}= mongoose
const notificationSchema = new Schema({
  acceptor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, 
        enum:["follow","like","repost","comment","message","save"],required: true },
        read:{
          type:Boolean,
          default:false 
        },
        media:{
          type:String,
          default:""
        },
    },
  {timestamps: true});
 const Notification = mongoose.model("Notification", notificationSchema);
export default Notification    