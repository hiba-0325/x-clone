const SearchSection: React.FC = () => {
    return (
      <div className="bg-black text-white  p-4 space-y-6 border-l border-gray-600">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-700 text-gray-300 py-2 px-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute top-2 right-3 w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-4.35-4.35M10 4a6 6 0 100 12 6 6 0 000-12z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
  
        <div className="hide-scrollbar overflow-y-scroll max-h-[85vh]">
          <div className="bg-black rounded-2xl p-4 flex flex-col justify-start border border-gray-600 ">
            <h2 className="text-lg font-bold mb-2">Subscribe to Premium</h2>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to unlock new features and if eligible, receive a share of
              revenue.
            </p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-3xl w-28 hover:bg-blue-600">
              Subscribe
            </button>
          </div>
  
          <div className="border border-gray-600 rounded-2xl p-4 mt-4">
            <h2 className="text-lg font-bold mb-4">What&apos;s happening</h2>
            <div className="space-y-4">
              {[
                {
                  category: "Trending in India",
                  topic: "#GukeshDing",
                  posts: "31.4K posts",
                },
                { category: "News · Trending", topic: "#RedAlert", posts: "" },
                {
                  category: "Entertainment · Trending",
                  topic: "#BoycottBollywood",
                  posts: "6,343 posts",
                },
                {
                  category: "Trending in India",
                  topic: "Magnus",
                  posts: "10.5K posts",
                },
                {
                  category: "Trending in India",
                  topic: "Magnus",
                  posts: "10.5K posts",
                },
                {
                  category: "Trending in India",
                  topic: "Magnus",
                  posts: "10.5K posts",
                },
                {
                  category: "Trending in India",
                  topic: "Magnus",
                  posts: "10.5K posts",
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">{item.category}</p>
                    <h3 className="font-bold text-base">{item.topic}</h3>
                    {item.posts && (
                      <p className="text-sm text-gray-400">{item.posts}</p>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-gray-300">
                    ...
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SearchSection;