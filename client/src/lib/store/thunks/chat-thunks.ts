import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

export const fetchParticipants = createAsyncThunk(
  "/fetchParticipants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/messages/list");
      return response.data.data.participants;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  "chat/fetchChatMessages",
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/messages/chat${chatId}`);
      return response.data.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSearchUsers = createAsyncThunk(
  "user/fetchSearchUsers",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/search?query=${query}`);
      return response.data.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  })