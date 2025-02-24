"use client";

import Image from "next/image";

const dummyTweets = [
  {
    id: 1,
    user: {
      name: "John Doe",
      userName: "johndoe",
      pfp: "/default-avatar.png",
    },
    text: "This is a sample tweet for the explorer page!",
    createdAt: "2023-10-01T12:34:56Z",
    likes: 12,
    comments: 3,
    reposts: 5,
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      userName: "janesmith",
      pfp: "/default-avatar.png",
    },
    text: "Another random tweet to fill up space.",
    createdAt: "2023-10-01T10:20:45Z",
    likes: 45,
    comments: 10,
    reposts: 8,
  },
];

const dummyTrends = [
  { name: "ReactJS", tweets: "12.3k" },
  { name: "Next.js", tweets: "9.8k" },
  { name: "Web Development", tweets: "7.6k" },
];

const dummyUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    userName: "alicej",
    pfp: "/default-avatar.png",
  },
  {
    id: 2,
    name: "Bob Williams",
    userName: "bobbyw",
    pfp: "/default-avatar.png",
  },
];

export default function ExplorerPage() {
  return (
    <div className="bg-black text-white min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-4">
        <h2 className="text-xl font-bold mb-4">Trends</h2>
        <ul>
          {dummyTrends.map((trend) => (
            <li key={trend.name} className="mb-2">
              <p className="font-bold">{trend.name}</p>
              <p className="text-gray-500">{trend.tweets} Tweets</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Explorer</h1>

        {/* Tweets */}
        <div className="space-y-4">
          {dummyTweets.map((tweet) => (
            <div key={tweet.id} className="p-4 border-b border-gray-700">
              <div className="flex gap-3">
                {/* Profile Picture */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={tweet.user.pfp}
                    alt={`${tweet.user.userName}'s profile`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Tweet Content */}
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">{tweet.user.name}</span>
                    <span className="text-gray-500 text-sm">
                      @{tweet.user.userName} ·{" "}
                      {new Date(tweet.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Tweet Text */}
                  <p className="text-white mb-4">{tweet.text}</p>

                  {/* Interaction Buttons */}
                  <div className="flex gap-8 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2-8h4v4h-4v-4z" />
                      </svg>
                      <span>{tweet.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h6l2-2h4a2 2 0 0 1 2 2v6zm-5-6v6h4v-6h-4zm0 8v6h4v-6h-4z" />
                      </svg>
                      <span>{tweet.reposts}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{tweet.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-64 bg-gray-900 p-4">
        <h2 className="text-xl font-bold mb-4">Who to Follow</h2>
        <ul>
          {dummyUsers.map((user) => (
            <li key={user.id} className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image
                  src={user.pfp}
                  alt={`${user.userName}'s profile`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold">{user.name}</p>
                <p className="text-gray-500">@{user.userName}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}