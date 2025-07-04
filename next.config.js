/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静态导出配置
  output: 'export',
  trailingSlash: true,
  // 只在生产环境使用basePath
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/Mindpulse',
    assetPrefix: '/Mindpulse',
  }),
  
  experimental: {
    appDir: true
  },
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
    domains: ['ui-avatars.com', 'via.placeholder.com', 'localhost'],
    remotePatterns: [{
      protocol: 'https',
      hostname: '**'
    }]
  },
  webpack: (config, {
    buildId,
    dev,
    isServer,
    defaultLoaders,
    webpack
  }) => {
    // 处理 Three.js 等模块的配置
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify-loader']
    });
    return config;
  },
  env: {
    CUSTOM_KEY: 'mindpulse-app'
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'X-Frame-Options',
        value: 'DENY'
      }, {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      }, {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      }]
    }];
  },
  // 移除rewrites，因为静态导出不支持
  distDir: process.env.NODE_ENV === "production" ? ".next-prod" : ".next",
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;