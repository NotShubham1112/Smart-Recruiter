import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@helix/ui', '@helix/types'],
};

export default nextConfig;
