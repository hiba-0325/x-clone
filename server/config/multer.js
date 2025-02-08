import multer from "multer";
import CustomError from "../utils/customError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = /jpeg|jpg|png|gif|mp4/;
  const isAllowed = allowedMimeTypes.test(file.mimetype);

  if (isAllowed) {
    cb(null, true); // File is accepted
  } else {
    cb(new CustomError("Invalid file type", 400), false); // Reject file with error
  }
};

const upload = multer({
  limits: { fileSize: 1024 * 1024 * 50 }, // 50 MB max file size
  fileFilter: fileFilter,
});

export default upload;
