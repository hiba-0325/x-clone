import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";

export const createComment = createAsyncThunk(
  "tweets/createComment",
  async (
    { tweetId, content }: { tweetId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(`/tweets/comment/${tweetId}`, {
        content,
      });
      return response.data.comment;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment"
      );
    }
  }
);

export const fetchUserComments = createAsyncThunk(
  "tweets/fetchUserComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`api/user/tweets/fetchUserComments`);
      return response.data.comments;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch comments"
      );
    }
  }
);
