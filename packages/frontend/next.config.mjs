// import { metadata } from './src/app/metadata';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // metadata (when needed, you can uncomment this line)
  images: {
    remotePatterns: [
      {
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
