import mongoose from "mongoose";

const {Schema}= mongoose
const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
   content:{
 type: String,
 required: true
   },
   read:{

    type:Boolean,
    default:false
   },
},
{timestamps: true},
);

const Message = mongoose.model("Message", messageSchema);

export default Message