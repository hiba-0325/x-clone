import cloudinary from "../config/cloudinaryconfig.js";
import CustomError from "../utils/customError.js";
import { PassThrough } from "stream";

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      req.uploadedFile = null; // Allow text-only tweets
      return next();
    }

    const buffer = req.file.buffer;
    const resourceType = req.file.mimetype.startsWith("image") ? "image" : "video";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: "X_clone_uploads",
      },
      (err, result) => {
        if (err) {
          console.error("Cloudinary Upload Error:", err);
          return next(new CustomError(`Failed to upload: ${err.message}`, 500));
        }

        if (!result || !result.public_id) {
          return next(new CustomError("Cloudinary did not return a valid response", 500));
        }

        req.uploadedFile = result;
        console.log("Upload Success:", result);
        next();
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  } catch (error) {
    console.error("Middleware Upload Error:", error.message);
    next(new CustomError("An unexpected error occurred", 500));
  }
};

export { uploadToCloudinary };
