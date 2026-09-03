import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/n3esjk8x/production/**',
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
