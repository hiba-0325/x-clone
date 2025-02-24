"use client"

import { useDispatch, useSelector } from "react-redux";
import router from 'next/router';
import { PiNotePencilBold } from "react-icons/pi";
import { RootState } from "@/lib/store/store";
import { useEffect, useState } from "react";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";
import {User} from "@/utils/types/types";
import { markMessageAsRead } from "@/lib/store/features/notification-slice";
import Image from "next/image";

function Chats({ visible }: { visible: boolean }) {
  const { currentUser } = useSelector((state: RootState) => state.currentUser);
  const [conversation, setConversation] = useState<
    (User & {
      lastMessage?: {
        content: string;
        createdAt: string;
      };
      unreadCount?: number;
      hasNewMessage?: boolean;
    })[]
  >([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getConversation = async (): Promise<void> => {
      try {
        const response = await axiosInstance.get("/messages/chat");
        setConversation(response.data.users);
      } catch (error) {
        console.log(axiosErrorCatch(error));
      }
    };
    getConversation();
  }, []);
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await axiosInstance.put("notifications/markAsRead");
        dispatch(markMessageAsRead());
      } catch (error) {
        console.log(axiosErrorCatch(error));
      }
    };
    markAsRead();
  }, [dispatch]);

  return (
    <div
      className={`lg:w-[30%] w-full px-5 h-[100vh] lg:border-r border-0 border-gray-800 ${
        visible ? "block" : "hidden sm:block"
      }`}
    >
      {/* Username and new chat icon */}
      <div className="flex h-20 items-end justify-between">
        <h1 className="text-xl font-bold">{currentUser?.userName}</h1>
        <button className="text-3xl">
          <PiNotePencilBold />
        </button>
      </div>
      {/* Current User */}
      <div className="h-40 flex items-center justify-start">
        <div className="flex items-center justify-center w-20 h-20 rounded-full overflow-hidden   ">
        <Image 
  src={currentUser?.pfp || "/default-profile.png"} 
  alt={currentUser?.userName || "User"} 
  width={40} 
  height={40} 
/>
        </div>
      </div>
      {/* Messages */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Messages</h1>
          {/* <p>Requests</p> */}
        </div>
        <div className="flex flex-col gap-3 pt-3">
          {conversation.map((conversation, index) => (
           <div
           onClick={() => {
             if (conversation.userName) {
               router.push(`/direct/t/${conversation.userName}`);
             } else {
               console.error('Username is undefined');
             }
           }}
           key={index}
           className="cursor-pointer hover:bg-gray-800 p-2 rounded-lg relative"
         >
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden">
                  <Image 
  src={conversation.pfp || "/default-profile.png"} 
  alt={conversation.userName || "User"} 
  width={40} 
  height={40} 
/>

                  </div>
                  <div>
                    <p>{conversation.userName}</p>
                    {conversation.lastMessage && (
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">
                        {conversation.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
                {conversation.hasNewMessage && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chats;
