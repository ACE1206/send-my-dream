/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });

        // Добавляем правило для обработки аудиофайлов
        config.module.rules.push({
            test: /\.(mp3|wav|ogg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
        });

        return config;
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
    },
    images: {
        domains: [
            'localhost',
            'space-link.online',
            'www.youtube.com',
            'flagcdn.com',
            'upload.wikimedia.org'
        ],
    },
};

module.exports = nextConfig;
