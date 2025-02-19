
import cloudinary from "../../config/cloudinaryconfig.js";
import User from "../../models/userModel.js";
import CustomError from "../../utils/customError.js";
import  tryCatch  from "../../utils/tryCatch.js";

 


const getAllUsers = async (req, res) => {
  const users = await User.find();

  if (!users || users.length < 1) {
    throw new CustomError("users not found", 404);
  }

  res
    .status(200)
    .json({message:"successfully fetched users", users});
};

const updateUserPfp = async (req, res, next) => {
  if(!req.file){
    return next(new CustomError("Please upload a file",400))
  }
  const user=await User.findById(req.user.id)
  if(!user){
    return next(new CustomError("User not found",404))
  }
  console.log(req.uploadedFile);
  console.log("check");
  if(user.pfp!=="https://i.pinimg.com/736x/20/05/e2/2005e27a39fa5f6d97b2e0a95233b2be.jpg"){
    await cloudinary.uploader.destroy(user.pfp)
  }
  user.pfp=req.uploadedFile.secure_url

  await user.save()
  res.status(200).json({message:"Profile picture updated successfully",profile:user.pfp})
  };
  

  
  const removeUserPfp = tryCatch(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
  
    if (user.pfp !== "https://i.pinimg.com/736x/20/05/e2/2005e27a39fa5f6d97b2e0a95233b2be.jpg") {
      const oldPublicId = user.pfp.split("/").pop().split(".")[0]; // Extract public_id from Cloudinary URL
      await cloudinary.uploader.destroy(`X_clone_uploads/${oldPublicId}`);
    }
  
    user.pfp = "https://i.pinimg.com/736x/20/05/e2/2005e27a39fa5f6d97b2e0a95233b2be.jpg";
    await user.save();
  
    res.status(200).json({ message: "Profile picture removed", pfp: user.pfp });
  });
  

//header
const updateUserHeader = async (req, res, next) => {
  if (!req.file) {
    return next(new CustomError("Please upload a file", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  console.log(req.uploadedFile);
  console.log("check");

  if (user.header && user.header !== "https://i.pinimg.com/736x/3a/c8/c4/3ac8c49fd8ba87a6dc02cc80b5015b7b.jpg") {
    await cloudinary.uploader.destroy(user.header);
  }

 
  user.header = req.uploadedFile.secure_url;

  await user.save();

  res.status(200).json({
    message: "Header updated successfully",
    header: user.header,
  });
};


// Remove header image
// 
const removeUserHeader = tryCatch(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  if (user.header !== "https://i.pinimg.com/736x/3a/c8/c4/3ac8c49fd8ba87a6dc02cc80b5015b7b.jpg") {
    await cloudinary.uploader.destroy(user.header);
  }

  user.header = "https://i.pinimg.com/736x/3a/c8/c4/3ac8c49fd8ba87a6dc02cc80b5015b7b.jpg";
  await user.save();

  res.status(200).json({ message: "Header image removed", header: user.header });
});



const updateProfile = async (req, res, next) => {
    try {
        const { name, bio, location, web,dob } = req.body;
        const userId = req.user.id;

        const updates = {};
        if (name) updates.name = name;
        if (bio) updates.bio = bio;
        if (web) updates.web = web;
        if (location) updates.location = location;
        if(dob) updates.dob=dob;
       

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({ success: true, user: updatedUser });
    }    catch (error) {
        return next(new CustomError("unexpected error", 500));
    }
};

export{getAllUsers ,updateProfile,updateUserPfp,removeUserPfp,updateUserHeader,removeUserHeader}
