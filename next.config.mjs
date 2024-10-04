/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // 画像最適化を無効化する
    remotePatterns: [{ hostname: "raw.githubusercontent.com" }],
    domains: ["raw.githubusercontent.com"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

export default nextConfig;
