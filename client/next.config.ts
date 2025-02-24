import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "i.pinimg.com"] // Add the hostname of your image URLs
  },
};


export default nextConfig;
