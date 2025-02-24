"use client";
import { useState } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HiMiniBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { IoChatbubbleOutline } from "react-icons/io5";
import { BsArrowRepeat } from "react-icons/bs"; // Repost icon
import {
  likeTweet,
  saveTweet,
  repostTweet,
} from "@/lib/store/thunks/tweet-thunks";
import { TweetData } from "@/utils/types/types";

interface TweetProps {
  tweet: TweetData; // Replace with your TweetData interface
}

function TweetCard({ tweet }: TweetProps) {
  // Map user string to user object if necessary
  const user =
    typeof tweet.user === "string"
      ? { _id: tweet.user, userName: "Unknown User", pfp: "/default-avatar.png" }
      : tweet.user;

  // Check if the current user has liked, saved, or reposted the tweet
  const currentUser = "currentUserId"; // Replace with actual user ID from auth context or state
  const [isLiked, setIsLiked] = useState(
    Array.isArray(tweet.likes) && tweet.likes.includes(currentUser)
  );
  const [isSaved, setIsSaved] = useState(
    Array.isArray(tweet.saved) && tweet.saved.includes(currentUser)
  );
  const [isReposted, setIsReposted] = useState(
    Array.isArray(tweet.reposts) && tweet.reposts.includes(currentUser)
  );

  const handleLike = async () => {
    try {
      await likeTweet(tweet._id); 
      setIsLiked(!isLiked); 
    } catch (error) {
      console.error("Error liking tweet:", error);
      alert("Failed to like the tweet. Please try again.");
    }
  };

  const handleSave = async () => {
    try {
      await saveTweet(tweet._id); 
      setIsSaved(!isSaved); 
    } catch (error) {
      console.error("Error saving tweet:", error);
      alert("Failed to save the tweet. Please try again.");
    }
  };

  const handleRepost = async () => {
    try {
      await repostTweet(tweet._id);
      setIsReposted(!isReposted); 
    } catch (error) {
      console.error("Error reposting tweet:", error);
      alert("Failed to repost the tweet. Please try again.");
    }
  };

  return (
    <div className="p-4 border-b border-gray-700 hover:bg-gray-900 transition">
      {/* Main Layout */}
      <div className="flex gap-3">
        {/* Profile Picture */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
          <Image
            src={user.pfp || "/default-avatar.png"} 
            alt={user.userName || "User Avatar"} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Tweet Content */}
        <div className="flex-1">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-white">{user.userName}</span>
            <span className="text-gray-500 text-sm">
              @{user.userName} ·{" "}
              {new Date(tweet.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Tweet Text */}
          <p className="text-white mb-4">{tweet.text}</p>

          {/* Media */}
          {tweet.media && tweet.media.length > 0 && (
            <div className="relative w-full h-auto aspect-[12/9] rounded-lg overflow-hidden">
              <Image
                src={tweet.media[0]}
                alt="Tweet Media"
                fill
                sizes="(max-width: 568px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Interaction Buttons */}
          <div className="flex gap-8 mt-4 text-gray-500">
            {/* Comment Button */}
            <button className="hover:text-blue-500 transition">
              <IoChatbubbleOutline size={20} />
            </button>

            {/* Repost Button */}
            <button
              onClick={handleRepost}
              className={`${
                isReposted ? "text-green-500" : "hover:text-green-500"
              } transition`}
            >
              <BsArrowRepeat size={20} />
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`${
                isLiked ? "text-red-500" : "hover:text-red-500"
              } transition`}
            >
              {isLiked ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`${
                isSaved ? "text-blue-500" : "hover:text-blue-500"
              } transition`}
            >
              {isSaved ? (
                <HiMiniBookmark size={20} />
              ) : (
                <HiOutlineBookmark size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetCard;