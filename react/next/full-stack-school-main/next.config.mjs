/*
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2024-09-21 20:15:07
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-08-15 21:24:17
 * @FilePath: /full-stack-school-main/next.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
};

export default nextConfig;
