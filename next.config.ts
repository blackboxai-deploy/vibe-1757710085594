import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Configurare simplă pentru a evita probleme de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // PWA și mobile optimizations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  // Disable source maps în producție pentru size
  productionBrowserSourceMaps: false,
}

export default nextConfig