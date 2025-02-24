import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/store/features/auth-slice";
import tweetReducer from "@/lib/store/features/tweet-slice";
import userReducer from "@/lib/store/features/user-slice";
import notificationReducer from "@/lib/store/features/notification-slice";
import chatReducer from "@/lib/store/features/chat-slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetReducer,
    user: userReducer,
    notification: notificationReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
