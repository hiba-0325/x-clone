/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";


const Instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: { name: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await Instance.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (userData: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await Instance.post("/auth/verifyOtp", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const finalSubmission = createAsyncThunk(
  "/auth/finalSubmission",
  async (
    userData: {
      name: string;
      userName: string;
      pfp: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await Instance.post("/auth/finalSubmission", userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

//login
export const loginUser = createAsyncThunk(
  "/auth/loginUser",
  async (
    credential: { loginField: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await Instance.post("/auth/loginUser", credential);
      const { data } = response;
      const userData = data.data;

      // Corrected Cookies.set syntax
      Cookies.set(
        "user",
        JSON.stringify({
          userName: userData.user.userName,
          email: userData.user.email,
          name: userData.user.name,
          token: userData.user.token,
          pfp: userData.user.pfp,
          id: userData.user._id,
        }),
        { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }
      );

      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


//authLogin

export const authLogin = createAsyncThunk(
  "/auth/authLogin",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await Instance.get(`/auth/authLogin/${email}`);
      const { data } = response;
      const userData = data.data;

      Cookies.set(
        "user",
        JSON.stringify({
          userName: userData.user.userName,
          email: userData.user.email,
          name: userData.user.name,
          token: userData.user.token,
          pfp: userData.user.pfp,
          id: userData.user._id,
        }),
        { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }
      );

   
      return userData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
