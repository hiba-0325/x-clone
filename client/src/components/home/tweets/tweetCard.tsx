"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { fetchTweetById } from "@/lib/store/thunks/tweet-thunks";
import Tweet, { LoggedUser } from "./tweet";
import Image from "next/image";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import SearchSection from "../search-section/search-section";
import { createComment } from "@/lib/store/thunks/comments-thunks";
import { CircularProgress } from "@mui/material";

export default function TweetById() {
  const { tweetId }: { tweetId: string } = useParams();
  const { tweet, loading } = useAppSelector((state) => state.tweets);
  const [loggedUser, setLoggedUser] = useState<LoggedUser>();
  const [commentText, setCommentText] = useState<string>("");
  const [isText, setIsText] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentUser = Cookies.get("user");
    const user = JSON.parse(currentUser || "{}");
    setLoggedUser(user);
    dispatch(fetchTweetById(tweetId));
  }, [tweetId, dispatch]);

  const handleComment = async () => {
    await dispatch(
      createComment({ tweetId: tweetId, content: commentText })
    ).unwrap();
    dispatch(fetchTweetById(tweetId));
    setCommentText("");
    setIsText(false);
    toast.success("commented successfully");
  };

  if (loading) {
    return <CircularProgress size={60} />;
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="overflow-y-auto w-full sm:w-1/2 border-r border-gray-600 sticky hide-scrollbar">
        <div>
          <Tweet {...tweet} />
        </div>
        <div className="flex justify-between h-20 border-b border-gray-600 items-center">
          <div className="flex gap-4">
            {loggedUser?.pfp && (
              <div>
                <Image
                  src={loggedUser?.pfp}
                  alt="profile"
                  className="w-12 h-12 rounded-full m-4"
                  width={48}
                  height={48}
                />
              </div>
            )}
            <div className="border-none">
              <textarea
                placeholder="Post Your Replay"
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  setIsText(e.target.value.length < 1 ? false : true);
                }}
                className="w-full bg-transparent text-gray-300 placeholder-gray-500 outline-none text-lg flex items-center resize-none overflow-hidden h-10"
              />
            </div>
          </div>
          <div
            className={`border border-none h-10 flex justify-center items-center rounded-3xl px-4 cursor-pointer  ${
              isText ? "bg-white text-black" : "bg-gray-600 text-white"
            }`}
            onClick={handleComment}
          >
            <div>Replay</div>
          </div>
        </div>
        <div>
          {tweet?.comments.map((comment) => (
            <Tweet key={comment._id} {...comment} />
          ))}
        </div>
      </div>
      <div className="hidden md:block sm:w-1/4">
        <SearchSection />
      </div>
    </div>
  );
}