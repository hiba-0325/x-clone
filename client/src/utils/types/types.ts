export type UserDetails = {
  _id: string;
  userName: string;
  email: string;
  name?: string;
  following?: string[];
  followers?: string[];
  pfp?: string;
  createdAt?: string;
};

export type Comment = {
  _id: string;
  user: UserDetails;
  text: string;
  createdAt: string;
};

export interface TweetData {
  _id: string;
  user: UserDetails;
  text: string;
  createdAt: string;
  media?: string[];
  comments?: string[];
  likes?: string[];
  repost?: string[];
  saved?: string[];
}

export interface CommentData {
  _id: string;
  user: UserDetails;
  text: string;
  createdAt: string;
}

export type FollowUser = {
  _id?: string;
  name?: string;
  userName?: string;
  pfp?: string;
  bio?: string;
  followers?: [];
  following?: [];
};

export interface User {
  _id: string;
  userName: string;
  email: string;
  name?: string;
  password?: string;
  header: string;
  bio?: string;
  following?: string[];
  followers?: string[];
  pfp?: string;
  updatedAt?: string;
  location?: string;
  web?: string;
  tweets: string[];
}
