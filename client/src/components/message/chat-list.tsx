"use client";

import { setSelectedUserId } from "@/lib/store/features/chat-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import {
  fetchParticipants,
  // fetchSearchUsers,
} from "@/lib/store/thunks/chat-thunks";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {LoggedUser} from "../home/tweets/tweet"
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axios";
import io from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);

export default function ChatList() {
  const { participants, users } = useAppSelector((state) => state.chat);
  const [loginedUser, setLoginedUser] = useState< LoggedUser | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchParticipants());
    const currentUser = Cookies.get("user");
    const user = JSON.parse(currentUser || "{}");
    setLoginedUser(user);
  }, [dispatch]);

  // const searchUsers = async (query: string) => {
  //   try {
  //     dispatch(fetchSearchUsers(query));
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //   }
  // };

  const handleUserSelect = async ({
    userId,
    userName,
  }: {
    userId: string;
    userName: string;
  }) => {
    const user1 = loginedUser?.id;
    const user2 = userId;
    dispatch(setSelectedUserId(userId));
    try {
      const isUserAlreadyInChat = participants?.some((i) => i._id === userId);

      if (isUserAlreadyInChat) {
        const { data } = await axiosInstance.get(`/chats/${user1}/${user2}`);
        const chatId = data?.data?.chatId;
        if (chatId) {
          socket.emit("joinRoom", { chatId });
          router.push(`/messages/${chatId}/${userName}`);
        }
      } else {
        const { data } = await axiosInstance.post(`/chats/create`, {
          user1,
          user2,
        });
        const chatId = data?.data?.chatId;
        if (chatId) {
          socket.emit("joinRoom", { chatId });
          router.push(`/messages/${chatId}/${userName}`);
        }
      }
    } catch (error) {
      console.error("Error handling user selection:", error);
    }
  };

  const list = users.length < 1 ? participants : users;

  return (
    <div>
      <div className="w-full border-r border-gray-800">
        <div className="text-2xl font-bold p-4">Messages</div>
        <div className="py-4">
          <input
            type="text"
            placeholder="Search user..."
            // onChange={(e) => searchUsers(e.target.value)}
            className="w-full p-2 bg-gray-900 text-white rounded-md"
          />
          <div className="overflow-y-auto h-[calc(100vh-150px)]">
            {list?.map((user) => (
              <div
                key={user._id}
                className="p-4 hover:bg-gray-800 cursor-pointer border-gray-600 border-b"
                onClick={() =>
                  handleUserSelect({
                    userId: user._id,
                    userName: user.userName,
                  })
                }
              >
                <h3 className="text-lg font-semibold">{user.userName}</h3>
                <p className="text-gray-400 text-sm">Last message...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}