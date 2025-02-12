import Notification from "../../models/notificationModel.js";
import User from "../../models/userModel.js";

// Get all notifications for a user
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ acceptor: req.user.id })
    .populate({ path: 'acceptor', match: { type: "like" } })
    .populate("sender", "name pfp")
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({ notifications });
};


const markAsRead = async (req, res) => {
  await Notification.updateMany(
    { acceptor: req.user.id, type: { $ne: "message" } },
    { $set: { read: true } }
  );
  res.status(200).json({ message: "Notifications marked as read" });
};

// Get unread notification count (excluding messages)
const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    acceptor: req.user.id,
    type: { $ne: "message" },
    read: false,
  });
  res.status(200).json({ count });
};

const markDmAsRead = async (req, res) => {
  await Notification.updateMany(
    { acceptor: req.user.id, type: "message" },
    { $set: { read: true } }
  );
  res.status(200).json({ message: " messages marked as read" });
};


const getUnreadDmCount = async (req, res) => {
  const notifications = await Notification.find({
    acceptor: req.user.id,
    type: "message",
  });
  const userIds = notifications.map((notification) => notification.sender);
  const users = await User.find({ _id: { $in: userIds } });
  const count = users.length;
  res.status(200).json({ count });
};


export { 
  getNotifications, 
  markAsRead, 
  getUnreadCount, 
  markDmAsRead, 
  getUnreadDmCount 
};
