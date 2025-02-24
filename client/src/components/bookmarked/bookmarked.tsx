"use client";
import { useEffect, useState } from "react";
import { getSavedTweets } from "@/lib/store/thunks/tweet-thunks";
import TweetCard from "../home/tweets/tweetCard";
import Header from "../home/navbar";

export default function BookmarksPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [savedTweets, setSavedTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedTweets = async () => {
      try {
        setLoading(true);
        const tweets = await getSavedTweets();
        setSavedTweets(tweets);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching saved tweets:", err);
        setError(err.message || "Failed to load saved tweets.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTweets();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col p-4 space-y-4">
        <h1 className="text-2xl font-bold">Bookmarks</h1>

        {/* Loading State */}
        {loading && <p className="text-gray-500">Loading saved tweets...</p>}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Saved Tweets */}
        {!loading && !error && savedTweets.length === 0 ? (
          <p className="text-gray-500">You have no saved tweets.</p>
        ) : (
          <div className="space-y-4">
            {savedTweets.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}