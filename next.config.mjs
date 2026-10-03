/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  serverExternalPackages: ["mongoose"],
};
export default nextConfig;
