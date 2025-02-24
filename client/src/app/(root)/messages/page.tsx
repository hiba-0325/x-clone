"use client";
import Chats from '@/components/message/chat';
import Messages from '@/components/message/messages'
import React from 'react'

export default function page() {
  return (
<div className="flex ps-0 lg:ps-72">
      <Chats visible={false} />
      <Messages />
    </div>
  )
}