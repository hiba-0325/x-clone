import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import Message from "./models/dmModel.js";
import Notification from "./models/notificationModel.js";
import jwt from "jsonwebtoken";
import{configDotenv} from "dotenv";

export const userSocketMap = {};
configDotenv();
const app = express();
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods:["GET","POST"]
    },
});

io.use((socket,next)=>{
    const token = socket.handshake.auth.token;
    if(!token ){
        return next(new Error("Authentication error"));
    }
    try{
        const user = jwt.verify(token,process.env.JWT_TOKEN);
        socket.handshake.auth.user = user.id;
        socket.data.userId=user.id;

        next();
    }catch(error){
        next(new Error("invalid token"));
    }
});

io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    socket.on("disconnect", async () => {
        delete userSocketMap[userId];
    });

    socket.on("join",()=>{
        userSocketMap[userId] = socket.id;
    });
    
    socket.on("sendDm", async (data) => {
        try{
            const message = await Message.create({
                sender:userId,
                receiver:data.receiverId,
                content:data.content,
            });

            //create dm notification

            const notification = await Notification.create({

                acceptor:data.receiverId,
                sender:userId,
                type:"message"
            });

            if(userSocketMap[data.receiverId]){
                io.to(userSocketMap[data.receiverId]).emit("receiveDm",message);
                io.to(userSocketMap[userId]).emit("newNotification",notification);
            }

        }catch(error){
            console.log("error occured during sending dm",error);
    
        }
    });

    socket.on("follow",async(data)=>{

        try{
            const notification = await Notification.create({
                acceptor:data.followingId,
                sender:userId,
                type:"follow"
            });
            if (userSocketMap[data.receiverId]){
                io.to(userSocketMap[data.followingId]).emit("newNotification",notification);
            } 
        }catch(error){
            console.log("error occured during notifs",error);
        }
    });
});