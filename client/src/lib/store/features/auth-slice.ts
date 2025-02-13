
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance, { axiosErrorCatch } from "@/utils/axios";
import Cookies from "js-cookie";

interface AuthState {
  user: string|null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// **Register User**
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name,userName, email, password }: { name: string;userName:string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", { name,userName, email, password });
      Cookies.set("user", JSON.stringify(response.data), { expires: 7 }); // Store user in cookies
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

// **Login User**
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      Cookies.set("user", JSON.stringify(response.data), { expires: 7 }); // Store user in cookies
      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorCatch(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      Cookies.remove("user"); // Remove user from cookies
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
