"use client";
import { useState } from "react";
import { createTweet } from "@/lib/store/thunks/tweet-thunks";

function TweetForm() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTweet(text, media);
      setText("");
      setMedia(undefined);
      alert("Tweet created successfully!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Please log in again.");
        alert("You are not authorized to perform this action.");
      } else {
        console.error("Error creating tweet:", error.message);
        alert("An error occurred while creating the tweet.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-700">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
        className="w-full bg-black text-white placeholder-gray-500 resize-none outline-none"
        rows={3}
      />
      <div className="flex justify-between items-center">
        <input
          type="file"
          onChange={(e) => setMedia(e.target.files?.[0])}
          className="text-sm text-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Tweet
        </button>
      </div>
    </form>
  );
}

export default TweetForm;
