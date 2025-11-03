import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Các cấu hình khác của bạn có thể ở đây */

  // 👇 Thêm khối 'images' này vào
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindcss.com',
        // Bạn có thể bỏ qua port và pathname nếu không cần giới hạn cụ thể
      },
      // Thêm các hostname khác nếu cần
    ],
  },
};

export default nextConfig;