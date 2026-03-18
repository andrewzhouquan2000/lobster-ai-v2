import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 部署 - 移除静态导出以支持 API Routes
  // output: 'export',  // 注释掉，Vercel 原生支持 SSR
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 环境变量
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;
