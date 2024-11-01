/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // 画像最適化を無効化する
    remotePatterns: [{ hostname: "raw.githubusercontent.com" }],
  },
};

export default nextConfig;
