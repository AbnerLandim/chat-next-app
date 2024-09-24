/* eslint-disable @typescript-eslint/no-unused-vars */
/** @type {import('next').NextConfig} */
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const nextConfig = {
  // output: "standalone",
  webpack: (config, { isServer }) => {
    config.resolve.alias["@"] = path.join(__dirname);
    return config;
  },
};

export default nextConfig;
