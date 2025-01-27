import express from "express";
import tryCatch from "../utils/tryCatch.js";
import {
  sendOtp,
  verifyRegister,
  userLogin,
  userLogout,
  refreshingToken,
} from "../controllers/authController.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router

  .post("/send_otp", tryCatch(sendOtp))
  .post("/register", tryCatch(verifyRegister))
  .post("/login", tryCatch(userLogin))
  .post("/logout", tryCatch(userLogout))
  .post("/refreshToken", tryCatch(refreshingToken));

export default router;
