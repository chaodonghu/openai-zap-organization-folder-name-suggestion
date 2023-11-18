/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  compiler: {
    emotion: {
      autoLabel: "always",
      labelFormat: "[filename]--[local]",
    },
  },
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcPlugins: [["next-superjson-plugin", { excluded: [] }]],
  },
  images: {
    domains: ["cdn.zapier.com", "cdn.zapier-staging.com", "zapier-staging.com", "zapier.com", "secure.gravatar.com"],
  },
  async rewrites() {
    return [
      // {
      //   source: "/api/guess-zap-onboarding",
      //   destination: "/api/onboarding/guess-zap",
      // },
    ];
  },
};
export default config;
