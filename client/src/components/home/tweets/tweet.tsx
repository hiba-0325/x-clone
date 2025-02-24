"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRetweet,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import Link from "next/link";
import {
  fetchTweetById,
  likedPost,
  savedPost,
} from "@/lib/store/thunks/tweet-thunks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import Cookies from "js-cookie";
import CommentBox from "./comment-box";
import { socket } from "@/components/message/chat-list";
import { format } from "date-fns";
import { Comment, UserDetails } from "@/utils/types/types";

export interface TweetProps {
  _id?: string;
  user?: UserDetails;
  text?: string;
  media?: string[];
  comments?: Comment[];
  likes?: { _id: string; userName: string; pfp?: string }[];
  reposts?: { _id: string; userName: string; pfp?: string }[];
  saved?: { _id: string; userName: string; pfp?: string }[]; 
  createdAt?: string;
}

export type LoggedUser = {
  id?: string | undefined;
  pfp: string;
};

export const getTimeAgo = (time: string) => {
  const messageDate = new Date(time);
  const currentDate = new Date();

  const diffInMilliseconds = currentDate.getTime() - messageDate.getTime();
  const diffInMinutes = diffInMilliseconds / (1000 * 60);
  const diffInHours = diffInMinutes / 60;
  const diffInDays = diffInHours / 24;

  if (diffInMinutes < 1) {
    return "Now";
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)} minute${
      Math.floor(diffInMinutes) > 1 ? "s" : ""
    }`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hour${
      Math.floor(diffInHours) > 1 ? "s" : ""
    } `;
  } else if (diffInDays < 1) {
    return "Yesterday";
  } else if (diffInDays < 2) {
    return "2 days ";
  } else {
    return format(messageDate, "dd-MM-yyyy HH:mm");
  }
};

const Tweet: React.FC<TweetProps> = ({
  _id,
  user,
  text,
  media,
  likes,
  saved,
  comments,
  reposts,
  createdAt,
}) => {
  const [liked, setLiked] = useState(false);
  const [save, setSave] = useState(false);
  const [likesCount, setLikesCount] = useState(likes?.length);
  const [repost, setRepost] = useState(reposts?.length);
  const dispatch = useAppDispatch();
  const { tweet } = useAppSelector((state) => state.tweets);
  const [loggedUser, setLoginedUser] = useState<LoggedUser>();
  const [commentCount, setCommentCount] = useState(comments?.length);

  useEffect(() => {
    const currentUser = Cookies.get("user");
    const user = JSON.parse(currentUser || "{}");
    const isLiked = likes?.includes(user.id) ? true : false;
    setLoginedUser(user);
    setLiked(isLiked ? true : false);

    const isSaved = saved?.includes(user.id);
    setSave(isSaved ? true : false);

    socket.on("updatedLikes", ({ updatedLikes, postId }) => {
      if (_id === postId) {
        setLikesCount(updatedLikes);
      }
    });

    socket.on("updatedComments", ({ postId, updatedComment }) => {
      if (postId === _id) {
        setCommentCount(updatedComment);
      }
    });
  }, [_id, likes, saved]);

  const handleLike = async (postId: string) => {
    try {
      const response = await dispatch(likedPost(postId)).unwrap();
      const currentUser = Cookies.get("user");
      const user = JSON.parse(currentUser || "{}");
      const isLikedNow = response.post.likes.includes(user.id);
      setLiked(isLikedNow);
      if (isLikedNow) {
        socket.emit("likes", { postId, userId: user.id });
      }
      setLikesCount(response.post.likes.length);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleRepost = () => {
    setRepost(repost && repost + 1);
  };

  const handleSave = async (postId: string) => {
    await dispatch(savedPost(postId));
    setSave(!save);
  };

  const handleCommand = (tweetId: string) => {
    dispatch(fetchTweetById(tweetId));
  };

  return (
    <div className="bg-black text-white border-b border-gray-700 p-4 flex space-x-4">
      <Link href={`/${user?.userName}`}>
        {user?.pfp ? (
          <Image
            src={user?.pfp}
            alt={`${user?.userName}'s profile`}
            className="w-12 h-12 rounded-full"
            width={48}
            height={48}
          />
        ) : (
          <div className="w-12 h-12 text-white bg-green-700 text-2xl flex justify-center items-center rounded-full">
            {user?.name && user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={`/${user?.userName}`}
              className="font-bold hover:underline"
            >
              {user?.name}
            </Link>
            <Link href={`/${user?.userName}`} className="text-gray-500 pl-2">
              @{user?.userName}
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            {createdAt && getTimeAgo(createdAt)}
          </p>
        </div>
        <Link href={`/${user?.userName}/status/${_id}`}>
          <p className="mt-2 text-sm">{text}</p>
          {media && (
            <div
              className={`mt-4 max-w-full ${
                media.length > 1 ? "grid grid-cols-2 gap-2 sm:grid-cols-3" : ""
              }`}
            >
              {media.map((m, i) => (
                <div key={i} className={`${media.length > 1 ? "" : "w-full"}`}>
                  <Image
                    src={m || ""}
                    alt="Media"
                    width={media.length > 1 ? 200 : 500}
                    height={media.length > 1 ? 200 : 300}
                    className={`rounded-lg ${
                      media.length > 1
                        ? " object-cover  w-full"
                        : "h-auto w-full"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </Link>

        <div className="flex justify-around mt-4 text-gray-400">
          <div className="flex justify-center items-center">
            <div onClick={() => handleCommand(_id || "")}>
              <CommentBox
                tweet={tweet}
                loggedUser={loggedUser || { pfp: "" }}
              />
            </div>
            <span>{commentCount}</span>
          </div>
          <button
            onClick={handleRepost}
            className="flex items-center space-x-1 hover:text-green-500"
            //repost
          >
            <FaRetweet />
            <span>{repost}</span>
          </button>
          <button
            onClick={() => handleLike(_id || "")}
            className="flex items-center space-x-1 hover:text-red-500"
          >
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => handleSave(_id || "")}
            className="flex items-center space-x-1 hover:text-yellow-500"
          >
            {save ? (
              <FaBookmark className="text-yellow-500" />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
