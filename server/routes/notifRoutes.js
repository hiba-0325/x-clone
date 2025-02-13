import express from "express";
import verifyToken from "../middlewares/auth.js";
import tryCatch from "../utils/tryCatch.js";
import {
getNotifications, 
markAsRead, 
getUnreadCount, 
markDmAsRead, 
getUnreadDmCount 
} from "../controllers/user/userNotifController.js";

const router = express.Router();

router

.get("/",verifyToken, tryCatch(getNotifications))
.get("/unread_Count",verifyToken, tryCatch(getUnreadCount))
.put("/markAsRead",verifyToken, tryCatch(markAsRead))
.get("/unreadDm", verifyToken,tryCatch(getUnreadDmCount))
.put("/dmAsRead", verifyToken,tryCatch(markDmAsRead));
export default router;