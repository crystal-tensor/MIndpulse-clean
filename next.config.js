/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  images: {
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
  async rewrites() {
    return [{
      source: '/api/quantum/:path*',
      destination: 'http://localhost:8000/api/:path*' // 量子服务代理
    }];
  },
  output: "standalone",
  distDir: process.env.NODE_ENV === "production" ? ".next-prod" : ".next",
  typescript: {
    ignoreBuildErrors: true
  }
};
module.exports = nextConfig;