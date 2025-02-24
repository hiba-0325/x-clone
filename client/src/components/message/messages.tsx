"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";

import { Message, User } from "@/utils/types/types";
import { socket } from "@/lib/socket";
import Image from "next/image";

function Messages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userName = searchParams.get("userName");
  // State Management
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Scroll to Bottom Logic
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current && shouldAutoScroll) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesContainerRef, shouldAutoScroll]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldAutoScroll(isNearBottom);
  };

  // Send Message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await axiosInstance.post("/api/messages/send", {
        receiverId: currUser?._id,
        content: message,
      });
      const newMessage = response.data.newMessage;
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setShouldAutoScroll(true);
    } catch (error) {
      console.error("Failed to send message:", axiosErrorCatch(error));
    }
  };

  // Fetch Messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currUser?._id) return;
      try {
        const response = await axiosInstance.get(
          `/api/messages/chat/${currUser._id}`
        );
        setMessages(response.data);
        setShouldAutoScroll(true);
      } catch (error) {
        console.error("Failed to fetch messages:", axiosErrorCatch(error));
      }
    };
    fetchMessages();
  }, [currUser?._id]);

  // Fetch Current User Profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!userName) return;
      try {
        const response = await axiosInstance.get(
          `/api/user/profile_pic/${userName}`
        );
        setCurrUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", axiosErrorCatch(error));
      }
    };
    fetchUser();
  }, [userName]);

  // Real-Time Message Updates via Socket.IO
  useEffect(() => {
    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
      setShouldAutoScroll(true);
    };
    socket.on("receiveMessage", handleMessage);
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);

  // Scroll to Bottom When Messages Update
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">

<div className="w-14 h-14 rounded-full overflow-hidden">
        
        </div>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-700">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div className="flex flex-col">
        <Image
            src={currUser?.pfp || "/default-avatar.png"}
            alt={currUser?.userName || "User Avatar"}
            width={52}
            height={52}
          />
          <span className="font-bold">{currUser?.name}</span>
          <span className="text-sm text-gray-400">@{currUser?.userName}</span>
        </div>
      </div>

      {/* Chat Window */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const showTimestamp =
              index === 0 ||
              new Date(msg.createdAt).getTime() -
                new Date(messages[index - 1]?.createdAt).getTime() >
                3600000;
            return (
              <div key={index} className="flex flex-col">
                {showTimestamp && (
                  <span className="text-center text-xs text-gray-500 my-2">
                    {new Date(msg.createdAt).toLocaleString([], {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <div
                  className={`flex ${
                    msg.sender === currUser?._id ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === currUser?._id
                        ? "bg-gray-800 text-white rounded-br-none"
                        : "bg-blue-500 text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-700 p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            className="flex-1 py-2 px-4 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="text-blue-500 font-semibold disabled:text-gray-500"
            disabled={!message.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;