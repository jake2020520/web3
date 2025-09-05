/** @type {import('next').NextConfig} */
const dedicatedEndPoint = "https://gola-nft-marketplace.infura-ipfs.io";
const dedicatedEndPoint1 = "https://gateway.pinata.cloud";
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      dedicatedEndPoint,
      "gola-nft-marketplace.infura-ipfs.io",
      dedicatedEndPoint1,
      "gateway.pinata.cloud",
      "copper-zippy-woodpecker-824.mypinata.cloud",
      "encrypted-tbn0.gstatic.com",
    ],

    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "**.music.126.net",
    //   },
    //   {
    //     protocol: "http",
    //     hostname: "**.music.126.net",
    //   },
    // ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};

module.exports = nextConfig;
