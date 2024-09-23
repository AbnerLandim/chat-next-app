/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.join(__dirname, '/');
    return config;
  },
};

export default nextConfig;
