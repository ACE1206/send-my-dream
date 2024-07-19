const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|mp3)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'assets',
                expiration: {
                    maxEntries: 50,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
        {
            urlPattern: /^https:\/\/sendmydream\.com\/.*$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'dynamic',
                networkTimeoutSeconds: 10,
                expiration: {
                    maxEntries: 50,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
    ],
    exclude: [/\/background-music\.mp3$/], // Исключаем несуществующий файл из кэширования
});

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

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
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    images: {
        domains: [
            'localhost',
            'sendmydream.com',
            'www.youtube.com',
            'flagcdn.com',
            'upload.wikimedia.org',
        ],
    },
};

module.exports = withPWA(nextConfig);
