/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/yt',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
