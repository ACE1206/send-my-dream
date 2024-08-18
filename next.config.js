const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|mp3|webp)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'assets',
                expiration: {
                    maxEntries: 100,
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
                networkTimeoutSeconds: 15,
                expiration: {
                    maxEntries: 100,
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
            },
        },
    ],
});

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//     enabled: process.env.ANALYZE === 'true',
// });
//
// const TerserPlugin = require('terser-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports =
    // withBundleAnalyzer(
    withPWA({
        webpack(config, { dev }) {
            // config.plugins = config.plugins.filter(
            //     (plugin) => !(plugin instanceof MiniCssExtractPlugin)
            // );
            //
            // if (!dev) {
            //     config.optimization.minimizer.push(new TerserPlugin());
            //     config.plugins.push(
            //         new MiniCssExtractPlugin({
            //             filename: '[name].[contenthash].css',
            //         })
            //     );
            // }

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

            config.module.rules.push({
                test: /\.(png|jpg|jpeg|gif|webp)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            fallback: 'file-loader',
                            name: '[path][name].[ext]',
                        },
                    },
                ],
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
    })
// );
