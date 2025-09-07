/*
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2025-07-22 06:32:46
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-09-07 15:33:57
 * @FilePath: /nft_marketplace/next.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
      "turquoise-used-flyingfish-346.mypinata.cloud",
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
