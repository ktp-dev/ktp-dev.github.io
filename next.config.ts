import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/life', destination: '/life/index.html', permanent: true },
      { source: '/life/', destination: '/life/index.html', permanent: true },
    ];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      use: 'raw-loader',
    });
    return config;
  },
  turbopack: {},
};

export default nextConfig;
