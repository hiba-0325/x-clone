import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllUsers,
  fetchFollowersOrFollowing,
  fetchUserData,
  toggleFollow,
} from "../thunks/user-thunks";
import { FollowUser, User } from "@/utils/types/types";



interface UserState {
  users: User[] | null;
  userDetails: User | null;
  isOwnProfile: boolean;
  followStatus: "follow" | "following";
  status: "idle" | "loading" | "failed";
  followUsers: FollowUser[] | null;
}

const initialState: UserState = {
  users: null,
  userDetails: null,
  isOwnProfile: false,
  followStatus: "follow",
  status: "idle",
  followUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsOwnProfile(state, action: PayloadAction<boolean>) {
      state.isOwnProfile = action.payload;
    },
    setFollowStatus: (state, action: PayloadAction<"follow" | "following">) => {
      state.followStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "idle";
        state.userDetails = action.payload;
        const isFollowing = action.payload.followers.some(
          (follower: FollowUser) =>
            follower.userName === state.userDetails?.userName
        );
        state.followStatus = isFollowing ? "following" : "follow";
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { followedUser } = action.payload;
        state.userDetails = followedUser;
      })
      .addCase(fetchFollowersOrFollowing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFollowersOrFollowing.fulfilled, (state, action) => {
        state.status = "idle";

        state.followUsers = action.payload.data;
      })
      .addCase(fetchFollowersOrFollowing.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setIsOwnProfile, setFollowStatus } = userSlice.actions;
export default userSlice.reducer;