import mongoose from "mongoose";

const idValidation = (req,res,next)=>{
    const {id} = req.params;

    if(!id){
        res.status(400).json({message:"id is required"})
    }
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message:"invalid id"})
    }next()
}
export default idValidation