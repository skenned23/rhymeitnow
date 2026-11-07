/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ship the per-word files (made by scripts/split-words.js) with the /rhymes-for function,
  // since the file name is only known at request time.
  experimental: {
    outputFileTracingIncludes: {
      '/rhymes-for/[word]': ['./data/generated/**/*'],
    },
  },
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
}

module.exports = nextConfig