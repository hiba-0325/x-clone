import User from "../../models/userModel.js";

import Notification from "../../models/notificationModel.js";
import Message from "../../models/dmModel.js";
import CustomError from "../../utils/customError.js";
import { io, userSocketMap } from "../../socket.js";

import mongoose from "mongoose";

const sendMessage = async (req, res, next) => {
  const { receiveId, content } = req.body;
  const senderId = req.user.id;

  if (senderId.toString() === receiveId.toString()) {
    return res
      .status(400)
      .json({ message: "You cannot send message to yourself" });
  }

  const receiver = await User.findById(receiveId);
  if (!receiver) {
    return next(new CustomError("User not found", 404));
  }

  const newMessage = await Message.create({
    sender: senderId,
    receiver: receiveId,
    content,
  });

  const notification = await Notification.create({
    acceptor: receiveId,
    sender: senderId,
    type: "message",
  });
  if (userSocketMap[receiveId]) {
    io.to(userSocketMap[receiveId]).emit("receiveDm", newMessage);
    io.to(userSocketMap[receiveId]).emit("newNotification", notification);
  }
  res.status(201).json({ newMessage: newMessage });
};

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  const otherUser = await User.findById(userId);
  if (!otherUser) {
    return next(new CustomError("User not found", 404));
  }

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  })

    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({ messages });
};

const markDmAsRead = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findOneAndUpdate(
      { _id: messageId, receiver: userId, read: false },
      { read: true }
    );

    if (!message) {
      return next(new CustomError("Message not found", 404));
    }

    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking message as read" });
  }
};
const getMessageList = async (req, res, next) => {
  const userId = req.user.id;
  const selectField = {
    name: 1,
    userName: 1,
    pfp: 1,
    _id: 1,
  };

  try {
    const messageUsers = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
          hasNewMessage: {
            $max: {
              $cond: [
                { $and: [{ $ne: ["$sender", new mongoose.Types.ObjectId(userId)] }, { $eq: ["$read", false] }] }, 
                1,
                0,
              ],
            },
          },
        },
      },
      { $limit: 5 },
    ]);

    if (messageUsers.length > 0) {
      const userIds = messageUsers.map((messageUser) => messageUser._id);
      const users = await User.find({ _id: { $in: userIds } }, selectField);

      const enchUsers = users.map((user) => {
        const messageInfo = messageUsers.find(
          (messageUser) => messageUser._id.toString() === user._id.toString()
        );
        return {
          ...user.toObject(), 
          lastMessage: messageInfo.lastMessage,
          unreadCount: messageInfo.hasNewMessage ? 1 : 0, 
        };
      });

      res.status(200).json({ users: enchUsers, source: "chats" });
    } else {
      res.status(200).json({ users: [], source: "chats" });
    }
  } catch (error) {
    console.error("Error in getMessageList:", error.message, error.stack);
    next(new CustomError(error.message || "Failed to fetch message list", 500));
  }
  
};

export { sendMessage, getMessages, markDmAsRead, getMessageList };
