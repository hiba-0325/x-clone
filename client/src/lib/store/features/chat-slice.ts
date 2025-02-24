import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchChatMessages,
  fetchParticipants,
  fetchSearchUsers,
  // fetchChat,
  // createChat,
} from "../thunks/chat-thunks";
import {Message} from "@/utils/types/types";
import { UserDetails } from "@/utils/types/types";

// Define the ChatSlice type
type ChatSlice = {
  participants: UserDetails[];
  users: UserDetails[];
  messages: Message[];
  chatId: string | null;
  selectedUserId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: ChatSlice = {
  participants: [],
  users: [],
  selectedUserId: null,
  messages: [],
  chatId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload); // Append new message
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.participants = action.payload;
        state.loading = false;
      })
      .addCase(fetchSearchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch participants";
      })
      .addCase(fetchSearchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchChatMessages.fulfilled,
        (state, action: PayloadAction<Message[]>) => {
          state.messages = action.payload;
          state.loading = false;
        }
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchChatMessages.rejected, (state, action: any) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setSelectedUserId, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;