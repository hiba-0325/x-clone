import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Notification } from '@/utils/types/types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  messageNotifications: Notification[];
  messageUnreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  messageNotifications: [],
  messageUnreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(notif => ({ ...notif, read: true }));
      state.unreadCount = 0;
    },
    markMessageAsRead: (state) => {
      state.messageNotifications = state.messageNotifications.map(notif => ({ ...notif, read: true }));
      state.messageUnreadCount = 0;
    },
    setMessageNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.messageNotifications = action.payload;
    },
    setMessageUnreadCount: (state, action: PayloadAction<number>) => {
      state.messageUnreadCount = action.payload;
    },
    addMessageNotification: (state, action: PayloadAction<Notification>) => {
      if(state.messageNotifications.find(notif => notif.sender.name === action.payload.sender.name)) return
      state.messageNotifications.unshift(action.payload);
      state.messageUnreadCount += 1;
  }
  }
});

export const { setNotifications, setUnreadCount, addNotification, markAllAsRead , addMessageNotification,setMessageNotifications,setMessageUnreadCount,markMessageAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;