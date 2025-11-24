/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Next's automatic font optimization when using Turbopack or
  // when running in an environment without outbound network access.
  // This prevents internal Turbopack font helpers from being referenced
  // and avoids build-time fetches to fonts.gstatic.com.
  experimental: {
    optimizeFonts: false,
  },
};

export default nextConfig;
