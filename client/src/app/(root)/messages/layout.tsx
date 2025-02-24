"use client";

import ChatList from "@/components/message/chat-list";
import { useParams } from "next/navigation";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { chatId, userId }: { chatId: string; userId: string } = useParams();

  return (
    <div className="flex h-screen text-white">
      <div
        className={`w-full sm:w-2/6 ${userId && chatId ? "hidden md:block" : "w-full"}`}
      >
        <ChatList />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}