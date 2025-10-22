import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { join } from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: join(__dirname, '../..')
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
