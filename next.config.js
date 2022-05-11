// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
 const nextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/knight-api/:slug*',
        destination: 'https://api.knightswap.financial/api/v2/:slug*',
      },
      {
        source: '/dark-knight-api/:slug*',
        destination: 'https://api.dark.knightswap.financial/api/v2/:slug*',
      },
    ]
  }
}

module.exports = nextConfig
