/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import { TweetData } from "@/utils/types/types";

// Create Tweet
export const createTweet = createAsyncThunk(
  "tweets/createTweet",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("api/user/tweets/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create tweet");
    }
  }
);

// Fetch Tweets
export const fetchTweets = createAsyncThunk<TweetData[]>(
  "tweets/fetchTweets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("api/user/tweets");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tweets");
    }
  }
);

// Fetch User Tweets
export const fetchUserTweet = createAsyncThunk<TweetData[], string>(
  "tweets/fetchUserTweet",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`api/user/tweets/${userId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tweets");
    }
  }
);

// Like a Tweet
export const likedPost = createAsyncThunk(
  "tweets/likedPost",
  async (tweetId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`api/user/tweets/likes/${tweetId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to like tweet");
    }
  }
);

// Save a Tweet
export const savedPost = createAsyncThunk(
  "tweets/savedPost",
  async (tweetId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`api/user/tweets/saved/${tweetId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to save tweet");
    }
  }
);

// Fetch Following Users' Tweets
export const fetchFollowingUserPost = createAsyncThunk(
  "tweets/fetchFollowingUserPost",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`api/user/tweets/following`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tweets");
    }
  }
);

// Fetch Liked Tweets
export const fetchLikedTweets = createAsyncThunk(
  "tweets/fetchLikedTweets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`api/user/tweets/liked`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tweets");
    }
  }
);

// Fetch Tweet by ID
export const fetchTweetById = createAsyncThunk(
  "tweets/fetchTweetById",
  async (tweetId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tweets/${tweetId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tweet");
    }
  }
);

// Repost a Tweet
export const repostTweet = async (tweetId: string) => {
  return axiosInstance.post(`api/user/tweets/repost/${tweetId}`);
};

// Comment on a Tweet
export const commentOnTweet = async (tweetId: string, content: string) => {
  return axiosInstance.post(`api/user/tweets/comment/${tweetId}`, { content });
};

// Delete a Tweet
export const deleteTweet = async (tweetId: string) => {
  return axiosInstance.delete(`api/user/tweets/delete/${tweetId}`);
};



// import { createAsyncThunk} from "@reduxjs/toolkit";
// import axiosInstance,{axiosErrorCatch} from "@/utils/axios";
// import { TweetData } from "@/utils/types/types";


// // create Tweet
// export const createTweet = createAsyncThunk(
//   "tweets/creatTweet",
//   async (formData: FormData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post("api/user/tweets/create", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data.data;
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to create tweet"
//       );
//     }
//   }
// );




// // Fetch Tweets
// export const getAllTweets = createAsyncThunk<TweetData[]>(
//   "tweets/fetchTweets",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get("api/user/tweets");
//       return response.data.data;
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch tweets"
//       );
//     }
//   }
// );



// export const likedPost = createAsyncThunk(
//   "tweets/likedPost",
//   async (tweetId: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(`api/user/tweets/like/${tweetId}`);
//       return response.data.data;

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch tweets"
//       );
//     }
//   }
// );

// // Save/Unsave a Tweet
// export const savedPost = createAsyncThunk(
//   "tweets/savedPost",
//   async (tweetId: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(`api/user/tweets/saved/${tweetId}`);

//       return response.data.data;

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data || "Failed to fetch tweets"
//       );
//     }
//   }
// );


// export const fetchLikedTweets = createAsyncThunk(
//   "tweets/fetchLikedTweets",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`api/user/tweets/liked`);
//       return response.data.data;

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to fetch tweets"
//       );
//     }
//   }
// );

// // Get Saved Tweets
// export const getSavedTweets = async () => {
//     try {
//       const response = await axiosInstance.get("api/user/tweets/saved");
//       return response.data.tweets;
   
//     } catch (error) {
//         console.error("Error fetching bookmarked tweets", error);
//         throw axiosErrorCatch(error);
//     }

//   };


//   export const fetchTweetById = createAsyncThunk(
//     "tweets/fetchTweetById",
//     async (postId: string, { rejectWithValue }) => {
//       try {
//         const response = await axiosInstance.get(`/tweets/${postId}`);
//         return response.data.data;
  
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (error: any) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to fetch tweets"
//         );
//       }
//     }
//   );
//   //////////////////////

// // Repost/Unrepost a Tweet
// export const repostTweet = async (tweetId:  TweetData["_id"]) => {
//   return axiosInstance.post(`api/user/tweets/repost/${tweetId}`);
// };

// // Comment on a Tweet
// export const commentOnTweet = async (tweetId:  TweetData["_id"], content: string) => {
//   return axiosInstance.post(`api/user/tweets/comment/${tweetId}`, { content });
// };

// // Delete a Tweet
// export const deleteTweet = async (tweetId: string) => {
//   return axiosInstance.delete(`api/user/tweets/delete/${tweetId}`);
// };