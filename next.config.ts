import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "my-blob-store.public.blob.vercel-storage.com",
        port: "",
      },
    ],
    domains: ["i.imgflip.com", "tan-usual-nightingale-869.mypinata.cloud"],
  },
};

export default nextConfig;
