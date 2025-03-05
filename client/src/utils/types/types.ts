export type UserDetails = {
  _id: string;
  userName: string;
  email: string;
  name?: string;
  following?: { _id: string; userName: string; pfp?: string }[];
  followers?: { _id: string; userName: string; pfp?: string }[];
  pfp?: string;
  tweets?: string[];
  createdAt?: string;
  accessToken?: string;
};
export type Comment = {
  _id: string;
  user: UserDetails;
  content: string;
  createdAt: string;
  tweet?: string;
};

export interface TweetData {
  _id: string;
  user: UserDetails;
  pfp?: string;
 userName?: string;
  text: string;
  createdAt: string;
  media?: string[];
  comments?: {
    _id: string;
    user: UserDetails;
    content: string;
    createdAt: string;
  }[];
  likes?: { _id: string; userName: string; pfp?: string }[];
  reposts?: { _id: string; userName: string; pfp?: string }[];
  saved?: { _id: string; userName: string; pfp?: string }[];
}
export interface CommentData {
  _id: string;
  user: UserDetails;
  text: string;
  createdAt: string;
}

export type FollowUser = {
  _id: string;
  name?: string;
  userName: string;
  pfp?: string;
  bio?: string;
  followers?: { _id: string; userName: string; pfp?: string }[];
  following?: { _id: string; userName: string; pfp?: string }[];
  tweets?: string[];
};

export interface User {
  _id: string;
  userName: string;
  email: string;
  name?: string;
  password?: string;
  header: string;
  bio?: string;
  following?: { _id: string; userName: string; pfp?: string }[];
  followers?: { _id: string; userName: string; pfp?: string }[];
  pfp?: string;
  updatedAt?: string;
  location?: string;
  web?: string;
  tweets: string[];
  likedTweets?: string[];
  savedTweets?: string[];
}

export interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// interfaces/notification.ts

export interface Notification {
  _id: string; 
  acceptor: {
    _id: string;
    name: string; 
    pfp?: string; 
  };
  sender: {
    _id: string; 
    name: string; 
    pfp?: string; 
  };
  type: "follow" | "like" | "repost" | "comment" | "message" | "save"; 
  read: boolean; 
  media?: string;
  createdAt: string; 
  updatedAt: string; 
}

// interface TweetProps {
//   _id: string;
//   user: UserDetails;
//   text: string;
//   createdAt: string;
//   media?: string[];
//   comments?: { _id: string; user: UserDetails; content: string; createdAt: string }[];
//   likes?: { _id: string; userName: string; pfp?: string }[];
//   reposts?: { _id: string; userName: string; pfp?: string }[];
//   saved?: { _id: string; userName: string; pfp?: string }[];
// }