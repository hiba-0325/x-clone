"use client"

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { markAllAsRead } from "@/lib/store/features/notification-slice";
import { format, isToday, isYesterday } from "date-fns";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";
import Image from "next/image";

interface Notification {
  _id: string;
  type: string;
  read: boolean;
  sender: {
    profile: string;
    username: string;
    fullname: string;
  };
  createdAt: string;
  media: string;
}

function NotificationPage() {
  const dispatch = useDispatch();
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );

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
      default:
        return "interacted with you";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <div className="space-y-6">
        {Object.keys(groupedNotifications).length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications yet</p>
        ) : (
          Object.entries(groupedNotifications).map(
            ([date, dayNotifications]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold mb-3">
                  {formatDateHeader(date)}
                </h3>
                <div className="space-y-4">
                  {dayNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-sm bg-black hover:bg-[#121212] transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={notification.sender.profile}
                          alt={notification.sender.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 text-sm">
                          <p>
                            <span className="font-semibold">
                              {notification.sender.username}
                            </span>{" "}
                            {getNotificationText(notification)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {format(new Date(notification.createdAt), "p")}
                          </p>
                        </div>
                        {notification.media && (
                          <Image
                            src={notification.media}
                            alt="Media"
                            className="w-12 h-12 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
