import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new CustomError("You are not authenticated", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new CustomError("Authentication token not provided", 403));
    }

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err.message);
        return next(new CustomError("Invalid or expired token", 403));
      }
      req.user = user;
      next();
    });
  } catch (err) {
   console.log(err);
    next(new CustomError("Failed to verify token", 500));
  }
};

export default verifyToken;
