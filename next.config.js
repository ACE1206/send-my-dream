/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        return config;
    },
    env: {
        NEXT_PUBLIC_API_URL:
        process.env.NEXT_PUBLIC_API_URL
    },
    images: {
    },
}

module.exports = nextConfig
