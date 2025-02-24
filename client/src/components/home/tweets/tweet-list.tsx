"use client";
import React, { useEffect, useState } from "react";
import Tweet from "@/components/home/tweets/tweet";
import { useAppDispatch, useAppSelector } from "@/lib/store/hook";
import { fetchFollowingUserPost } from "@/lib/store/thunks/tweet-thunks";
import { CircularProgress } from "@mui/material";
import { TweetData } from "@/utils/types/types";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";

const TweetList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { followingTweets, activeTab, error } = useAppSelector(
    (state) => state.tweets
  );
  const [isStatus, setIsStatus] = useState("");

  useEffect(() => {
    const status = (() => {
      try {
        const storedStatus = localStorage.getItem("status");
        return storedStatus ? JSON.parse(storedStatus) : "forYou";
      } catch (error) {
        console.error("Failed to parse status from localStorage:", error);
        return "forYou"; // Default value
      }
    })();
    setIsStatus(status);
  }, [activeTab]);

  const fetchTweets = async (): Promise<TweetData[]> => {
    const res = await axiosInstance.get("api/user/tweets");
    if (res.data) {
      return res.data.data;
    } else {
      throw new Error("Failed to fetch tweets");
    }
  };

  const { data, isLoading } = useQuery<TweetData[], Error>({
    queryKey: ["tweets"],
    queryFn: fetchTweets,
  });

  useEffect(() => {
    dispatch(fetchFollowingUserPost());
  }, [activeTab, dispatch]);

  const posts = isStatus === "forYou" ? data : followingTweets;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {isLoading ? (
        <div className="flex justify-center items-center h-[70vh] text-gray-400">
          <CircularProgress size={60} />
        </div>
      ) : (
        posts?.map((tweet, index) => <Tweet key={index} {...tweet} />)
      )}
    </div>
  );
};

export default TweetList;