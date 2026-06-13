/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/',
        has: [{ type: 'query', key: 'word' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'ref' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/rhymes-for/:word',
        destination: '/rhymes-with/:word',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig