"use client";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { markAllAsRead } from "@/lib/store/features/notification-slice";
import { format, isToday, isYesterday } from "date-fns";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";
import Image from "next/image";

import { Notification } from "@/utils/types/types";
function NotificationPage() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    const markAsRead = async () => {
      try {
        await axiosInstance.put("/notifications/markAsRead");
        dispatch(markAllAsRead());
      } catch (error) {
        console.log(axiosErrorCatch(error));
      }
    };
    markAsRead();
  }, [dispatch]);


  const groupedNotifications = useMemo(() => {
    return notifications.reduce((acc, notification) => {
      const date = format(new Date(notification.createdAt), "yyyy-MM-dd");
      if (!acc[date]) acc[date] = [];
      acc[date].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);
  }, [notifications]);

  
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  // Get notification text based on type
  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "follow":
        return "started following you";
      case "message":
        return "sent you a message";
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "repost":
        return "reposted your post";
      default:
        return "interacted with you";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>

      {/* No Notifications Message */}
      {Object.keys(groupedNotifications).length === 0 && (
        <p className="text-gray-500 text-center py-8">No notifications yet</p>
      )}

      {/* Notifications List */}
      {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
        <div key={date}>
          {/* Date Header */}
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
            {formatDateHeader(date)}
          </h3>

          {/* Individual Notifications */}
          <div className="space-y-4">
            {dayNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 p-4 rounded-lg hover:bg-[#1e1e1e] transition-colors ${
                  !notification.read ? "bg-[#2f3136]" : ""
                }`}
              >
                {/* Sender Profile Picture */}
                <Image
                  src={notification.sender.pfp || "/default-avatar.png"}
                  alt={notification.sender.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {/* Notification Content */}
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-semibold">{notification.sender.name}</span>{" "}
                    {getNotificationText(notification)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {format(new Date(notification.createdAt), "h:mm a")}
                  </p>
                </div>

                {/* Media Preview */}
                {notification.media && (
                  <Image
                    src={notification.media}
                    alt="Media"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationPage;