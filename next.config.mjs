import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  cacheComponents: true,
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
});
