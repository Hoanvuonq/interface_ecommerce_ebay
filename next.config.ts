import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverSourceMaps: false, 
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8888",
        pathname: "/uploads/**",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "dlcdnwebimgs.asus.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', 
      },
      {
        protocol: "https",
        hostname: "pub-5341c10461574a539df355b9fbe87197.r2.dev",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'api.calatha.com', // Thay bằng domain server thật của bạn
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
        pathname: "/**",
      },
     {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "down-vn.img.susercontent.com", // Domain ảnh thật từ Shopee (có trong mock data)
      },
      {
        protocol: "https",
        hostname: "dummyimage.com", // Domain ảnh placeholder
      },
      {
        protocol: "https",
        hostname: "**", // (Tùy chọn) Dùng dòng này nếu muốn chấp nhận mọi ảnh (chỉ dùng khi dev)
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*', 
        destination: 'https://api.calatha.com/api/v1/:path*', 
      },
    ]
  },
};

export default nextConfig;