/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getAllTweets } from "@/lib/store/thunks/tweet-thunks";
import Header from "./navbar";
import TweetForm from "./tweets/tweetForm";
import TweetCard from "./tweets/tweetCard";

export default function HomePage() {
  // State to hold tweets
  const [tweets, setTweets] = useState<any[]>([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const data = await getAllTweets();

        // Sort tweets by createdAt in descending order (newest first)
        const sortedTweets = data.sort(
          
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setTweets(sortedTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };

    fetchTweets();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col p-4 space-y-4">
        {/* Tweet Form */}
        <TweetForm />

        {/* Tweet Feed */}
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))}
        </div>
      </main>
    </div>
  );
}